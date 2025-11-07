/*
CJS version to run in projects with "type": "module" in package.json
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

  let connString = envUrl;
  try {
    const u = new URL(envUrl);
    u.searchParams.delete('channel_binding');
    connString = u.toString();
  } catch (e) {
    // ignore
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

    try {
      await client.query(rawSql);
      console.log('SQL applied successfully (single-query execution).');
    } catch (e) {
      console.warn('Single-query execution failed, attempting split execution. Error:', e.message);
      const statements = [];
      const regex = /DO \$\$[\s\S]*?\$\$/g;
      let lastIndex = 0;
      let m;
      while ((m = regex.exec(rawSql)) !== null) {
        const start = m.index;
        const end = regex.lastIndex;
        if (start > lastIndex) statements.push(rawSql.slice(lastIndex, start));
        statements.push(rawSql.slice(start, end));
        lastIndex = end;
      }
      if (lastIndex < rawSql.length) statements.push(rawSql.slice(lastIndex));

      const execStmts = [];
      for (const part of statements) {
        const trimmed = part.trim();
        if (!trimmed) continue;
        if (trimmed.startsWith('DO $$')) {
          execStmts.push(trimmed);
        } else {
          const subs = trimmed.split(/;\s*\n/).map(s => s.trim()).filter(Boolean);
          execStmts.push(...subs);
        }
      }

      for (const st of execStmts) {
        try {
          await client.query(st);
        } catch (innerErr) {
          console.error('Failed to execute statement (truncated):', st.slice(0, 200));
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
