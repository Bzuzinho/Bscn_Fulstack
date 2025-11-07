import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";

import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
import { storage } from "./storage.ts";
import { pool } from "./db.ts";
import bcrypt from "bcryptjs";

// REPLIT_DOMAINS is required in production for the OIDC strategies.
// In development we allow it to be missing and fall back to the dev auth flow.
if (!process.env.REPLIT_DOMAINS && process.env.NODE_ENV === 'production') {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}

const getOidcConfig = memoize(
  async () => {
    const issuerRaw = process.env.ISSUER_URL ?? "https://replit.com/oidc";
    let issuerUrl: URL;
    try {
      issuerUrl = new URL(issuerRaw);
    } catch (e: any) {
      console.error(`Invalid ISSUER_URL provided: ${issuerRaw}`, e?.message ?? e);
      throw new Error(`Invalid ISSUER_URL environment variable: ${issuerRaw}`);
    }

    return await client.discovery(issuerUrl, process.env.REPL_ID!);
  },
  { maxAge: 3600 * 1000 }
);

const disableReplitAuth = process.env.DISABLE_REPLIT_AUTH === 'true' || process.env.NODE_ENV !== 'production';

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    // prefer passing an existing pool instance to avoid connection-string parsing
    // differences between environments (and avoid libpq/URI quirks)
    pool: pool,
    // allow creating the sessions table automatically in development
    createTableIfMissing: process.env.NODE_ENV !== 'production',
    ttl: sessionTtl,
    tableName: "sessions",
  });
  const isProd = process.env.NODE_ENV === 'production';
  // Allow overriding cookie domain when running behind preview hosts that use
  // different subdomains for different ports (e.g. *.app.github.dev). When
  // COOKIE_DOMAIN is set we must use SameSite=None and secure cookies so the
  // browser will send the cookie cross-site between subdomains.
  const cookieDomain = process.env.COOKIE_DOMAIN;
  const useCrossSiteCookies = !!cookieDomain;

  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProd || useCrossSiteCookies,
      sameSite: useCrossSiteCookies ? 'none' : 'lax',
      domain: cookieDomain || undefined,
      maxAge: sessionTtl,
    },
  });
}

function updateUserSession(
  user: any,
  tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers
) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}

async function upsertUser(
  claims: any,
) {
  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"],
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  if (!disableReplitAuth) {
    const config = await getOidcConfig();

    const verify: VerifyFunction = async (
      tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
      verified: passport.AuthenticateCallback
    ) => {
      const user = {};
      updateUserSession(user, tokens);
      await upsertUser(tokens.claims());
      verified(null, user);
    };

    for (const domain of process.env.REPLIT_DOMAINS!.split(",")) {
      const strategy = new Strategy(
        {
          name: `replitauth:${domain}`,
          config,
          scope: "openid email profile offline_access",
          callbackURL: `https://${domain}/api/callback`,
        },
        verify,
      );
      passport.use(strategy);
    }

    passport.serializeUser((user: Express.User, cb) => cb(null, user));
    passport.deserializeUser((user: Express.User, cb) => cb(null, user));

    app.get("/api/login", (req, res, next) => {
      passport.authenticate(`replitauth:${req.hostname}`, {
        prompt: "login consent",
        scope: ["openid", "email", "profile", "offline_access"],
      })(req, res, next);
    });

    app.get("/api/callback", (req, res, next) => {
      passport.authenticate(`replitauth:${req.hostname}`, {
        successReturnToOrRedirect: "/",
        failureRedirect: "/api/login",
      })(req, res, next);
    });

    app.get("/api/logout", (req, res) => {
      req.logout(() => {
        res.redirect(
          client.buildEndSessionUrl(config, {
            client_id: process.env.REPL_ID!,
            post_logout_redirect_uri: `${req.protocol}://${req.hostname}`,
          }).href
        );
      });
    });
  } else {
    // Development mode: don't use external OIDC logout flow (avoids invalid_client)
    passport.serializeUser((user: Express.User, cb) => cb(null, user));
    passport.deserializeUser((user: Express.User, cb) => cb(null, user));

    app.get("/api/login", (req, res) => {
      // In dev we rely on POST /api/login (JSON) for credentials; redirect to that flow
      res.status(200).json({ message: "Use POST /api/login for dev authentication" });
    });

    app.get("/api/callback", (_req, res) => {
      res.status(200).send('Dev callback - no-op');
    });

    app.get("/api/logout", (req, res) => {
      req.logout(() => {
        try {
          req.session?.destroy(() => {
            res.redirect('/');
          });
        } catch (e) {
          res.redirect('/');
        }
      });
    });
  }

  // Support JSON email/password login for local development.
  // This mirrors what the Laravel backend does in production for /api/login.
  app.post("/api/login", async (req, res) => {
    try {
      const { email, password } = req.body ?? {};
      if (!email || !password) {
        return res.status(400).json({ message: "Missing credentials" });
      }

      // find user in DB
      const q = await pool.query('SELECT id, email, name, password, role FROM users WHERE email = $1 LIMIT 1', [email]);
      const row = q.rows[0];
      if (!row) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const hashed = row.password ?? '';
      const ok = await bcrypt.compare(password, hashed);
      if (!ok) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Build a session user object compatible with isAuthenticated
      const now = Math.floor(Date.now() / 1000);
      // Include role and basic profile info in the session claims so
      // server- and client-side permission checks can rely on the session.
      const sessionUser: any = {
        claims: { sub: row.id, email: row.email, name: row.name, role: row.role || 'membro' },
        access_token: null,
        refresh_token: null,
        expires_at: now + 60 * 60 * 24, // 1 day
      };

      // login via passport to create session
      req.login(sessionUser, (err: any) => {
        if (err) {
          console.error('req.login error', err);
          return res.status(500).json({ message: 'Failed to create session' });
        }
        return res.json({ message: 'Login successful' });
      });
    } catch (err) {
      console.error('POST /api/login error', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const user = req.user as any;

  if (!req.isAuthenticated() || !user.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const now = Math.floor(Date.now() / 1000);
  if (now <= user.expires_at) {
    return next();
  }

  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};
