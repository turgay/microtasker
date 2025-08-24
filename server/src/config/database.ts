import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

// Create Neon connection with explicit typing
const sql = neon(process.env.DATABASE_URL);

// Create Drizzle database instance with type assertion
export const db = drizzle(sql as any);

// Connection test function
export async function connectDatabase() {
  try {
    // Test the connection with a simple query
    await sql`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
}
