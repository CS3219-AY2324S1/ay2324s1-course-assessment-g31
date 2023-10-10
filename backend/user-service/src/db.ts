import { Pool, QueryResult } from "pg";

const poolConfig = {
  user: "postgres",
  host: "34.142.179.10",
  database: "postgres",
  password: "cs3219assignmentgroup31",
  port: 5432,
};

const dockerPoolConfig = {
  user: "admin",
  host: "postgres_user_service",
  database: "postgres",
  password: "password",
  port: 5432,
};
// Create a PostgreSQL connection pool
const db = new Pool(process.env.USE_DOCKER_DB ? dockerPoolConfig : poolConfig);

export default db;
