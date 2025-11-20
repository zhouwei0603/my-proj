import { randomUUID } from "crypto";
import * as MySql from "mysql2";
import * as Log from "../log/log";
import { appendPagingSql, execute, GetAllParams, appendOrderBySql } from "./db";

export interface Part {
  id: string;
  name: string;
}

export const create = async (part: Omit<Part, "id">, log: Log.Context) => {
  return await execute(async (connection) => {
    const obj: Part = {
      id: randomUUID().toLowerCase(),
      name: part.name,
    };

    const sql = "INSERT INTO part SET id = ?, name = ?";
    const params = [obj.id, obj.name];

    Log.writeInfo("DB will create part: ", Object.assign({ data: { SQL: sql, Params: params } }, log));

    await connection.execute(sql, params);

    Log.writeInfo("DB created part: ", Object.assign({ data: obj }, log));

    return await findById(obj.id, log);
  }, log);
};

export const findById = async (id: string, log: Log.Context) => {
  return await execute(async (connection) => {
    const sql = `SELECT * FROM part WHERE id = ?`;
    const params = [id];

    Log.writeInfo("DB will find part: ", Object.assign({ data: { SQL: sql, Params: params } }, log));

    const res = await connection.execute<MySql.RowDataPacket[]>(sql, params);

    const rows = res[0];

    if (rows?.length) {
      const obj = rows[0] as Part;

      Log.writeInfo(`DB found part with id: ${id}`, Object.assign({ data: obj }, log));

      return obj;
    } else {
      throw {
        kind: "not_found",
        message: `The part with id ${id} was not found.`,
      };
    }
  }, log);
};

export const getAll = async (name: string, params: GetAllParams, log: Log.Context) => {
  return await execute(async (connection) => {
    let valueSql = "SELECT * FROM part";
    let totalSql = "SELECT COUNT(id) as total FROM part";

    if (name) {
      const where = ` WHERE name LIKE '%${name}%'`;
      valueSql += where;
      totalSql += where;
    }

    // TODO: Make orderBy and orderDirection configurable
    valueSql = appendOrderBySql(valueSql, "id", "ASC");
    valueSql = appendPagingSql(valueSql, params);

    Log.writeInfo("DB will get parts: ", Object.assign({ data: { valueSql, totalSql } }, log));

    const res = await Promise.all([
      connection.execute<MySql.RowDataPacket[]>(valueSql),
      connection.execute<MySql.RowDataPacket[]>(totalSql),
    ]);

    const result = {
      total: res[1][0][0]["total"],
      value: res[0][0],
    };

    Log.writeInfo("DB got parts: ", Object.assign({ data: result }, log));

    return result;
  }, log);
};

export const updateById = async (id: string, part: Omit<Part, "id">, log: Log.Context) => {
  return await execute(async (connection) => {
    const obj: Omit<Part, "id"> = {
      name: part.name,
    };

    const sql = "UPDATE part SET name = ? WHERE id = ?";
    const params = [obj.name, id];

    Log.writeInfo("DB will update part: ", Object.assign({ data: { SQL: sql, Params: params } }, log));

    const res = await connection.execute<MySql.ResultSetHeader>(sql, params);

    if (res[0].affectedRows === 0) {
      throw {
        kind: "not_found",
        message: `The part with id ${id} was not found.`,
      };
    } else {
      Log.writeInfo("DB updated part: ", Object.assign({ data: obj }, log));

      return await findById(id, log);
    }
  }, log);
};

export const remove = async (id: string, log: Log.Context) => {
  return await execute(async (connection) => {
    const sql = "DELETE FROM part WHERE id = ?";
    const params = [id];

    Log.writeInfo("DB will delete part: ", Object.assign({ data: { SQL: sql, Params: params } }, log));

    const res = await connection.execute<MySql.ResultSetHeader>(sql, params);

    if (res[0].affectedRows == 0) {
      throw {
        kind: "not_found",
        message: `The part with id ${id} was not found.`,
      };
    } else {
      Log.writeInfo(`DB deleted part with id: ${id}`, log);
    }
  }, log);
};
