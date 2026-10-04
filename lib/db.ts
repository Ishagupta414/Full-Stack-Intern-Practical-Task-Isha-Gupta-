import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.local.DB_HOST,
  user: process.env.local.DB_USER,
  password: process.env.local.DB_PASSWORD,
  database: process.env.local.DB_NAME,
  port: Number(process.env.local.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
