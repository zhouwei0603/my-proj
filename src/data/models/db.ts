import * as MySql from "mysql2/promise";
import { config } from "../config/db.config";
import * as Log from "../log/log";
import moment = require("moment");

// Create a connection pool
const pool = MySql.createPool({
  host: config.HOST,
  user: config.USER,
  password: config.PASSWORD,
  database: config.DB,
  port: config.PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const toMySqlString = (value: Date) =>
  moment(value).format("YYYY-MM-DD HH:mm:ss");

export const execute = async <T>(
  action: (connection: MySql.PoolConnection) => Promise<T>,
  log: Log.Context
) => {
  // Get a connection from the pool
  const connection = await pool.getConnection();

  try {
    // Execute a simple query
    return await action(connection);
  } catch (err) {
    Log.writeError("DB error", Object.assign({ error: err }, log));

    throw err;
  } finally {
    // Release the connection back to the pool
    connection.release();
  }
};

export interface DbError {
  kind: "not_found" | "internal";
  message: string;
}
