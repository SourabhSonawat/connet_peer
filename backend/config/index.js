import dotenv from "dotenv";
import pkg from "pg";
const { Pool } = pkg;

dotenv.config();

const connectionString = `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`;

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

const testDbconnection = async () => {
  try {
    console.log(connectionString);
    const res = await pool.query("SELECT 1");
    console.log("Database connected successfully:", res.rows);
  } catch {
    console.error("Error connecting to the database:", err.stack);
    process.exit(1);
  }
};

testDbconnection();
export { pool };

export const query = (text, params) => pool.query(text, params);
export const end = () => pool.end();
