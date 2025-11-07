const { Client } = require('pg');

async function main() {
  const sql = `
ALTER TABLE faturas ADD COLUMN IF NOT EXISTS valor numeric(12,2) DEFAULT 0;
ALTER TABLE faturas ADD COLUMN IF NOT EXISTS data_vencimento date;
`;
  const envUrl = process.env.DATABASE_URL;
  if (!envUrl) {
    console.error('Please set DATABASE_URL env var');
    process.exit(2);
  }

  let connString = envUrl;
  try {
    const u = new URL(envUrl);
    u.searchParams.delete('channel_binding');
    connString = u.toString();
  } catch (e) {}

  const client = new Client({ connectionString: connString, ssl: { rejectUnauthorized: false } });
  try {
    await client.connect();
    console.log('Connected, executing SQL...');
    await client.query(sql);
    console.log('ALTER TABLE executed successfully');
    await client.end();
    process.exit(0);
  } catch (err) {
    console.error('Failed to execute SQL:', err);
    try { await client.end(); } catch (e) {}
    process.exit(1);
  }
}

main();
