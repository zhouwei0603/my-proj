import { randomUUID } from "crypto";
import * as MySql from "mysql2";
import * as Log from "../log/log";
import { appendPagingSql, execute, GetAllParams, toMySqlString } from "./db";

export interface POItem {
  id: string;
  poid: string;
  partid: string;
  count: number;
  created: string;
  createdby: string;
  modified?: string;
  modifiedby?: string;
}

export const create = async (item: Omit<POItem, "id" | "created" | "modified" | "modifiedby">, log: Log.Context) => {
  return await execute(async (connection) => {
    const obj: POItem = {
      id: randomUUID().toLowerCase(),
      poid: item.poid,
      partid: item.partid,
      count: item.count,
      created: toMySqlString(new Date()),
      createdby: item.createdby,
    };

    const sql = "INSERT INTO poitem SET id = ?, poid = ?, partid = ?, count = ?, created = ?, createdby = ?";
    const params = [obj.id, obj.poid, obj.partid, obj.count, obj.created, obj.createdby];

    Log.writeInfo("DB will create poitem: ", Object.assign({ data: { SQL: sql, Params: params } }, log));

    await connection.execute(sql, params);

    Log.writeInfo("DB created poitem: ", Object.assign({ data: obj }, log));

    return await findById(obj.id, log);
  }, log);
};

export const findById = async (id: string, log: Log.Context) => {
  return await execute(async (connection) => {
    const sql = `SELECT * FROM poitem WHERE id = ?`;
    const params = [id];

    Log.writeInfo("DB will find poitem: ", Object.assign({ data: { SQL: sql, Params: params } }, log));

    const res = await connection.execute<MySql.RowDataPacket[]>(sql, params);

    const rows = res[0];

    if (rows?.length) {
      const obj = rows[0] as POItem;

      Log.writeInfo(`DB found poitem with id: ${id}`, Object.assign({ data: obj }, log));

      return obj;
    } else {
      throw {
        kind: "not_found",
        message: `The poitem with id ${id} was not found.`,
      };
    }
  }, log);
};

export const getAll = async (poid: string, params: GetAllParams, log: Log.Context) => {
  return await execute(async (connection) => {
    {
      const res = await connection.execute<MySql.RowDataPacket[]>(`SELECT id FROM po WHERE id = ?`, [poid]);

      if (!res[0].length) {
        Log.writeError(`DB found po with id: ${poid}`, log);

        throw {
          kind: "not_found",
          message: `The po with id ${poid} was not found.`,
        };
      }
    }

    let valueSql = "SELECT * FROM poitem WHERE poid = ?";
    let totalSql = "SELECT COUNT(id) as total FROM poitem WHERE poid = ?";

    valueSql = appendPagingSql(valueSql, params);

    Log.writeInfo("DB will get poitems: ", Object.assign({ data: { valueSql, totalSql } }, log));

    const res = await Promise.all([
      connection.execute<MySql.RowDataPacket[]>(valueSql, [poid]),
      connection.execute<MySql.RowDataPacket[]>(totalSql, [poid]),
    ]);

    const result = {
      total: res[1][0][0]["total"],
      value: res[0][0],
    };

    Log.writeInfo("DB got poitems: ", Object.assign({ data: result }, log));

    return result;
  }, log);
};

export const updateById = async (
  id: string,
  item: Omit<POItem, "id" | "created" | "createdby" | "modified">,
  log: Log.Context
) => {
  return await execute(async (connection) => {
    const obj: Omit<POItem, "id" | "created" | "createdby"> = {
      poid: item.poid,
      partid: item.partid,
      count: item.count,
      modified: toMySqlString(new Date()),
      modifiedby: item.modifiedby,
    };

    const sql = "UPDATE poitem SET poid = ?, partid = ?, count = ?, modified = ?, modifiedby = ? WHERE id = ?";
    const params = [obj.poid, obj.partid, obj.count, obj.modified, obj.modifiedby, id];

    Log.writeInfo("DB will update poitem: ", Object.assign({ data: { SQL: sql, Params: params } }, log));

    const res = await connection.execute<MySql.ResultSetHeader>(sql, params);

    if (res[0].affectedRows === 0) {
      throw {
        kind: "not_found",
        message: `The poitem with id ${id} was not found.`,
      };
    } else {
      Log.writeInfo("DB updated poitem: ", Object.assign({ data: obj }, log));

      return await findById(id, log);
    }
  }, log);
};

export const remove = async (id: string, log: Log.Context) => {
  return await execute(async (connection) => {
    const sql = "DELETE FROM poitem WHERE id = ?";
    const params = [id];

    Log.writeInfo("DB will delete poitem: ", Object.assign({ data: { SQL: sql, Params: params } }, log));

    const res = await connection.execute<MySql.ResultSetHeader>(sql, [id]);

    if (res[0].affectedRows == 0) {
      throw {
        kind: "not_found",
        message: `The poitem with id ${id} was not found.`,
      };
    } else {
      Log.writeInfo(`DB deleted poitem with id: ${id}`, log);
    }
  }, log);
};
