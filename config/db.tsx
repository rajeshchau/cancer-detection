import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// Handle the case where DATABASE_URL is not defined
const dbUrl = process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/mydatabase';

// Create the SQL client with error handling
let sql;
try {
  sql = neon(dbUrl);
} catch (e) {
  console.error('Error connecting to database:', e);
  // Provide a fallback that won't crash but will log errors
  sql = neon('postgres://user:password@localhost:5432/dummy');
}

export const db = drizzle(sql);
