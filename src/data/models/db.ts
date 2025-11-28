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

export const toMySqlString = (value: Date) => moment(value).format("YYYY-MM-DD HH:mm:ss");

export const execute = async <T>(action: (connection: MySql.PoolConnection) => Promise<T>, log: Log.Context) => {
  // Get a connection from the pool
  const connection = await pool.getConnection();

  try {
    // TODO: remove the delay in production
    if (process.env.NODE_ENV !== "production") {
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }

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

export const appendPagingSql = (sql: string, params: GetAllParams) => {
  let start = params.start || 0;
  let end: number;

  if (typeof params.end === "undefined") {
    if (typeof params.size === "undefined") {
      end = start + 99;
    } else {
      end = start + params.size - 1;
    }
  } else {
    end = params.end;
  }

  sql += ` LIMIT ${end - start + 1} OFFSET ${start}`;

  return sql;
};

export const appendOrderBySql = (sql: string, orderBy: string, orderDirection: "ASC" | "DESC") => {
  sql += ` ORDER BY ${orderBy} ${orderDirection}`;
  return sql;
};

export interface DbError {
  kind: "not_found" | "internal";
  message: string;
}

export interface GetAllParams {
  start?: number;
  end?: number;
  size?: number;
}

export interface GetAllResponseBody<T = any> {
  total: number;
  value: T[];
}
