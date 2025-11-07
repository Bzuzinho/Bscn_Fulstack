import { pool } from "../server/db";
import bcrypt from "bcryptjs";

async function main() {
  const email = process.env.CREATE_USER_EMAIL || 'admin@benedita.pt';
  const name = process.env.CREATE_USER_NAME || 'Admin Benedita';
  const password = process.env.CREATE_USER_PASSWORD || 'password123';

  const hashed = await bcrypt.hash(password, 10);

  try {
    const q = await pool.query(
      `INSERT INTO users (email, name, password, role, created_at, updated_at) VALUES ($1, $2, $3, $4, now(), now()) ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password, name = EXCLUDED.name, role = EXCLUDED.role RETURNING id, email, name, role`,
      [email, name, hashed, 'admin']
    );

    console.log('Upserted user:', q.rows[0]);
    console.log('Password for login:', password);
  } catch (err) {
    console.error('Failed to create user', err);
    process.exit(1);
  }
}

main();
