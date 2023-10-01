import { Pool, QueryResult } from "pg";

// Create a PostgreSQL connection pool
const db = new Pool({
  user: "postgres",
  host: "34.142.179.10",
  database: "postgres",
  password: "cs3219assignmentgroup31",
  port: 5432,
});

export default db;
