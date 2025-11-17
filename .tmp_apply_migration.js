const fs = require('fs');
const { Client } = require('pg');
(async ()=>{
  try{
    const env = fs.readFileSync('.env','utf8');
    const line = env.split('\n').find(l => l.startsWith('DATABASE_URL='));
    const url = process.env.DATABASE_URL || (line && line.split('=')[1]);
    if(!url){ console.error('NO DATABASE_URL'); process.exit(2); }
    const sql = fs.readFileSync('backend/database/migrations/2025_11_10_000002_add_missing_user_columns.sql','utf8');
    const client = new Client({ connectionString: url, ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 10000 });
    console.log('connecting to database...');
    await client.connect();
    console.log('connected, running migration...');
    await client.query(sql);
    console.log('MIGRATION_APPLIED_OK');
    await client.end();
  }catch(e){
    console.error('MIGRATION_ERROR');
    console.error(e && e.message ? e.message : e);
    process.exit(1);
  }
})();
