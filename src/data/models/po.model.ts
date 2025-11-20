import { randomUUID } from "crypto";
import * as MySql from "mysql2";
import * as Log from "../log/log";
import { appendPagingSql, execute, GetAllParams, toMySqlString, appendOrderBySql } from "./db";

export interface PO {
  id: string;
  title: string;
  created: string;
  createdby: string;
  modified?: string;
  modifiedby?: string;
}

export const create = async (po: Omit<PO, "id" | "created" | "modified" | "modifiedby">, log: Log.Context) => {
  return await execute(async (connection) => {
    const obj: PO = {
      id: randomUUID().toLowerCase(),
      title: po.title,
      created: toMySqlString(new Date()),
      createdby: po.createdby,
    };

    const sql = "INSERT INTO po SET id = ?, title = ?, created = ?, createdby = ?";
    const params = [obj.id, obj.title, obj.created, obj.createdby];

    Log.writeInfo("DB will create po: ", Object.assign({ data: { SQL: sql, Params: params } }, log));

    await connection.execute(sql, params);

    Log.writeInfo("DB created po: ", Object.assign({ data: obj }, log));

    return await findById(obj.id, log);
  }, log);
};

export const findById = async (id: string, log: Log.Context) => {
  return await execute(async (connection) => {
    const sql = `SELECT * FROM po WHERE id = ?`;
    const params = [id];

    Log.writeInfo("DB will find po: ", Object.assign({ data: { SQL: sql, Params: params } }, log));

    const res = await connection.execute<MySql.RowDataPacket[]>(sql, params);

    const rows = res[0];

    if (rows?.length) {
      const obj = rows[0] as PO;

      Log.writeInfo(`DB found po with id: ${id}`, Object.assign({ data: obj }, log));

      return obj;
    } else {
      throw {
        kind: "not_found",
        message: `The po with id ${id} was not found.`,
      };
    }
  }, log);
};

export const getAll = async (title: string, params: GetAllParams, log: Log.Context) => {
  return await execute(async (connection) => {
    let valueSql = "SELECT * FROM po";
    let totalSql = "SELECT COUNT(id) as total FROM po";

    if (title) {
      const where = ` WHERE title LIKE '%${title}%'`;
      valueSql += where;
      totalSql += where;
    }

    // TODO: Make orderBy and orderDirection configurable
    valueSql = appendOrderBySql(valueSql, "id", "ASC");
    valueSql = appendPagingSql(valueSql, params);

    Log.writeInfo("DB will get pos: ", Object.assign({ data: { valueSql, totalSql } }, log));

    const res = await Promise.all([
      connection.execute<MySql.RowDataPacket[]>(valueSql),
      connection.execute<MySql.RowDataPacket[]>(totalSql),
    ]);

    const result = {
      total: res[1][0][0]["total"],
      value: res[0][0],
    };

    Log.writeInfo("DB got pos: ", Object.assign({ data: result }, log));

    return result;
  }, log);
};

export const updateById = async (
  id: string,
  po: Omit<PO, "id" | "created" | "createdby" | "modified">,
  log: Log.Context
) => {
  return await execute(async (connection) => {
    const obj: Omit<PO, "id" | "created" | "createdby"> = {
      title: po.title,
      modified: toMySqlString(new Date()),
      modifiedby: po.modifiedby,
    };

    const sql = "UPDATE po SET title = ?, modified = ?, modifiedby = ? WHERE id = ?";
    const params = [obj.title, obj.modified, obj.modifiedby, id];

    Log.writeInfo("DB will update po: ", Object.assign({ data: { SQL: sql, Params: params } }, log));

    const res = await connection.execute<MySql.ResultSetHeader>(sql, params);

    if (res[0].affectedRows === 0) {
      throw {
        kind: "not_found",
        message: `The po with id ${id} was not found.`,
      };
    } else {
      Log.writeInfo("DB updated po: ", Object.assign({ data: obj }, log));

      return await findById(id, log);
    }
  }, log);
};

export const remove = async (id: string, log: Log.Context) => {
  return await execute(async (connection) => {
    const sql = "DELETE FROM po WHERE id = ?";
    const params = [id];

    Log.writeInfo("DB will delete po: ", Object.assign({ data: { SQL: sql, Params: params } }, log));

    const res = await connection.execute<MySql.ResultSetHeader>(sql, [id]);

    if (res[0].affectedRows == 0) {
      throw {
        kind: "not_found",
        message: `The po with id ${id} was not found.`,
      };
    } else {
      Log.writeInfo(`DB deleted po with id: ${id}`, log);
    }
  }, log);
};
