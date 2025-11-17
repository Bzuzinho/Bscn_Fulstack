const { Client } = require('pg');
const fs = require('fs');
(async()=>{
  try{
    const env = fs.existsSync('.env') ? fs.readFileSync('.env','utf8') : '';
    const line = (env.split(/\n/).find(l=>l.startsWith('DATABASE_URL='))||'');
    const DATABASE_URL = line.replace(/^DATABASE_URL=/,'').trim();
    if(!DATABASE_URL){ console.error('DATABASE_URL missing'); process.exit(2); }
    const client = new Client({ connectionString: DATABASE_URL });
    await client.connect();
    const sql = `ALTER TABLE users ADD COLUMN IF NOT EXISTS conta_corrente varchar(100);`;
    console.log('Executing SQL:', sql);
    await client.query(sql);
    console.log('OK: ALTER applied');
    await client.end();
  }catch(e){ console.error('ERR', e); process.exit(1); }
})();
