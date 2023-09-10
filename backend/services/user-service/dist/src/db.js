"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
// Create a PostgreSQL connection pool
const db = new pg_1.Pool({
    user: 'postgres',
    host: '34.142.179.10',
    database: 'postgres',
    password: 'cs3219assignmentgroup31',
    port: 5432,
});
exports.default = db;
