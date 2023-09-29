import { Pool, QueryResult } from "pg";

// Create a PostgreSQL connection pool
const db = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "sam",
  port: 5432,
});

export default db;
