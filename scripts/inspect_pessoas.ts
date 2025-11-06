import { setTimeout } from 'timers/promises';
import ws from 'ws';
import { Pool, neonConfig } from '@neondatabase/serverless';

neonConfig.webSocketConstructor = ws;

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL missing');
  process.exit(1);
}

const pool = new Pool({ connectionString: DATABASE_URL });

async function main(){
  try{
    const res = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'pessoas'");
    console.log('columns for pessoas:');
    console.table(res.rows);
  }catch(err){
    console.error('error', err);
  } finally{
    await pool.end();
    process.exit(0);
  }
}

main();
