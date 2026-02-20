import { Pool, type QueryResult } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export async function query<T = unknown>(sql: string, params: unknown[] = []): Promise<QueryResult<T>> {
  return pool.query<T>(sql, params);
}

export { pool };
