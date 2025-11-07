/*
Apply scripts/bscn_schema_postgres.sql using Node's pg client.
Usage:
  DATABASE_URL="postgresql://..." node scripts/apply_migration_node.js

This script connects with SSL (rejectUnauthorized: false) to work with Neon.
It reads the SQL file and sends it as a single query. If the SQL engine rejects multiple
statements at once, we fall back to splitting on `;\n` (basic heuristic).
*/

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

async function main() {
  const sqlPath = path.resolve(__dirname, 'bscn_schema_postgres.sql');
  if (!fs.existsSync(sqlPath)) {
    console.error('SQL file not found at', sqlPath);
    process.exit(2);
  }

  const rawSql = fs.readFileSync(sqlPath, 'utf8');

  const envUrl = process.env.DATABASE_URL;
  if (!envUrl) {
    console.error('Please set DATABASE_URL environment variable.');
    process.exit(2);
  }

  // Use the connection string but remove unsupported query params like channel_binding
  // and keep endpoint SNI via options if present in host domain (Neon usually works over TLS/SNI).
  let connString = envUrl;
  try {
    const u = new URL(envUrl);
    // Remove channel_binding if present
    u.searchParams.delete('channel_binding');
    // Keep sslmode if present; pg library uses ssl config instead, we'll set ssl below.
    // Use the sanitized connection string
    connString = u.toString();
  } catch (e) {
    // fallback: use as-is
  }

  const client = new Client({
    connectionString: connString,
    ssl: {
      rejectUnauthorized: false,
    },
    statement_timeout: 0,
  });

  try {
    console.log('Connecting to DB...');
    await client.connect();
    console.log('Connected. Applying SQL file...');

    // Try to run the whole file as one query
    try {
      await client.query(rawSql);
      console.log('SQL applied successfully (single-query execution).');
    } catch (e) {
      console.warn('Single-query execution failed, attempting split execution. Error:', e.message);
      // Simple split by semicolon followed by newline. This is a heuristic and may fail for $$ blocks.
      // Better approach: detect DO $$ blocks and preserve them.
      const statements = [];
      let remainder = rawSql;

      // Extract $$...$$ blocks and execute them together
      const parts = [];
      const regex = /DO \$\$[\s\S]*?\$\$/g;
      let lastIndex = 0;
      let m;
      while ((m = regex.exec(rawSql)) !== null) {
        const start = m.index;
        const end = regex.lastIndex;
        if (start > lastIndex) parts.push(rawSql.slice(lastIndex, start));
        parts.push(rawSql.slice(start, end));
        lastIndex = end;
      }
      if (lastIndex < rawSql.length) parts.push(rawSql.slice(lastIndex));

      for (const part of parts) {
        const trimmed = part.trim();
        if (!trimmed) continue;
        if (trimmed.startsWith('DO $$')) {
          // execute as-is
          statements.push(trimmed);
        } else {
          // split by semicolons
          const subs = trimmed.split(/;\s*\n/).map(s => s.trim()).filter(Boolean);
          statements.push(...subs);
        }
      }

      for (const st of statements) {
        try {
          await client.query(st);
        } catch (innerErr) {
          console.error('Failed to execute statement:', st.slice(0, 200));
          throw innerErr;
        }
      }

      console.log('SQL applied successfully (split execution).');
    }

    await client.end();
    process.exit(0);
  } catch (err) {
    console.error('Error applying migration:', err);
    try { await client.end(); } catch (_) {}
    process.exit(1);
  }
}

main();
