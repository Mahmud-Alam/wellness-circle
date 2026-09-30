import app from "./app.js";
import env from "./config/env.js";
import pool from "./config/db.js";

const start = async () => {
  try {
    await pool.query("SELECT NOW()");
    console.log("[db] connected");

    app.listen(env.port, () => {
      console.log(`[server] running on http://localhost:${env.port}`);
      console.log(`[server] environment: ${env.nodeEnv}`);
    });
  } catch (err) {
    console.error("[server] failed to start:", err.message);
    process.exit(1);
  }
};

start();

process.on("SIGINT", async () => {
  await pool.end();
  process.exit(0);
});
