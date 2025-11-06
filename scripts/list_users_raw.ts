import { pool } from "../server/db";

async function main(){
  try {
    const res = await pool.query('SELECT id, email, name, password, created_at FROM users LIMIT 20');
    console.log('rows:', res.rows.length);
    console.dir(res.rows, { depth: null, maxArrayLength: null });
  } catch(err){
    console.error('raw query error', err);
    process.exit(1);
  }
}

main();
