import { randomUUID } from "crypto";
import * as MySql from "mysql2";
import * as Log from "../log/log";
import { execute, toMySqlString } from "./db";

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

export const create = async (
  item: Omit<POItem, "id" | "created" | "modified" | "modifiedby">,
  log: Log.Context
) => {
  return await execute(async (connection) => {
    const obj: POItem = {
      id: randomUUID().toLowerCase(),
      poid: item.poid,
      partid: item.partid,
      count: item.count,
      created: toMySqlString(new Date()),
      createdby: item.createdby,
    };

    await connection.execute(
      "INSERT INTO poitem SET id = ?, poid = ?, partid = ?, count = ?, created = ?, createdby = ?",
      [obj.id, obj.poid, obj.partid, obj.count, obj.created, obj.createdby]
    );

    Log.writeInfo("DB created poitem: ", Object.assign({ data: obj }, log));

    return await findById(obj.id, log);
  }, log);
};

export const findById = async (id: string, log: Log.Context) => {
  return await execute(async (connection) => {
    const res = await connection.execute<MySql.RowDataPacket[]>(
      `SELECT * FROM poitem WHERE id = ?`,
      [id]
    );

    const rows = res[0];

    if (rows?.length) {
      const obj = rows[0] as POItem;

      Log.writeInfo(`DB found poitem with id: ${id}`, Object.assign({ data: obj }, log));

      return obj;
    } else {
      throw { kind: "not_found", message: `The poitem with id ${id} was not found.` };
    }
  }, log);
};

export const getAll = async (poid: string, log: Log.Context) => {
  return await execute(async (connection) => {
    let res = await connection.execute<MySql.RowDataPacket[]>(
      `SELECT id FROM po WHERE id = ?`,
      [poid]
    );

    if (!res[0].length) {
      Log.writeError(`DB found po with id: ${poid}`, log);

      throw { kind: "not_found", message: `The po with id ${poid} was not found.` };
    }

    res = await connection.execute<MySql.RowDataPacket[]>(
      "SELECT * FROM poitem WHERE poid = ?",
      [poid]
    );

    const rows = res[0];

    Log.writeInfo("DB poitems: ", Object.assign({ data: rows }, log));

    return rows as POItem[];
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

    const res = await connection.execute<MySql.ResultSetHeader>(
      "UPDATE poitem SET poid = ?, partid = ?, count = ?, modified = ?, modifiedby = ? WHERE id = ?",
      [obj.poid, obj.partid, obj.count, obj.modified, obj.modifiedby, id]
    );

    if (res[0].affectedRows === 0) {
      throw { kind: "not_found", message: `The poitem with id ${id} was not found.` };
    } else {
      Log.writeInfo("DB updated poitem: ", Object.assign({ data: obj }, log));

      return await findById(id, log);
    }
  }, log);
};

export const remove = async (id: string, log: Log.Context) => {
  return await execute(async (connection) => {
    const res = await connection.execute<MySql.ResultSetHeader>(
      "DELETE FROM poitem WHERE id = ?",
      [id]
    );

    if (res[0].affectedRows == 0) {
      throw { kind: "not_found", message: `The poitem with id ${id} was not found.` };
    } else {
      Log.writeInfo(`DB deleted poitem with id: ${id}`, log);
    }
  }, log);
};
