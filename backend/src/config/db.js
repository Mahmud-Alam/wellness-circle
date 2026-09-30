import { Pool } from "pg";
import env from "./env.js";

const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on("error", (err) => {
  console.error("[db] unexpected error", err.message);
});

export const query = async (text, params) => {
  const start = Date.now();
  const result = await pool.query(text, params);
  if (env.nodeEnv === "development") {
    console.log("[db]", {
      text,
      duration: `${Date.now() - start}ms`,
      rows: result.rowCount,
    });
  }
  return result;
};

export const getClient = () => pool.connect();

export default pool;
