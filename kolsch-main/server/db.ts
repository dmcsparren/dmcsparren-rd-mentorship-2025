import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

const DATABASE_URL = process.env.DATABASE_URL || 'postgres://dylan.mcsparren@localhost:5432/kolsch_db';

console.log('Attempting to connect to database:', DATABASE_URL.replace(/:\/\/.*@/, '://[credentials hidden]@'));

export const pool = new pg.Pool({ connectionString: DATABASE_URL });

// Add error handling for the pool
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Test the connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected successfully at:', res.rows[0].now);
  }
});

export const db = drizzle(pool, { schema });