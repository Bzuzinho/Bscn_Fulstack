import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Log the DATABASE_URL (sanitized) to help diagnose URL parsing issues during dev.
// In production avoid logging credentials.
try {
  console.log('Using DATABASE_URL:', process.env.DATABASE_URL?.slice(0, 80));
} catch {}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });
