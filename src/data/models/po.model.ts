import { randomUUID } from "crypto";
import * as MySql from "mysql2";
import * as Log from "../log/log";
import { execute, toMySqlString } from "./db";

export interface PO {
  id: string;
  title: string;
  created: string;
  createdby: string;
  modified?: string;
  modifiedby?: string;
}

export const create = async (
  po: Omit<PO, "id" | "created" | "modified" | "modifiedby">,
  log: Log.Context
) => {
  return await execute(async (connection) => {
    const obj: PO = {
      id: randomUUID().toLowerCase(),
      title: po.title,
      created: toMySqlString(new Date()),
      createdby: po.createdby,
    };

    await connection.execute(
      "INSERT INTO po SET id = ?, title = ?, created = ?, createdby = ?",
      [obj.id, obj.title, obj.created, obj.createdby]
    );

    Log.writeInfo("DB created po: ", Object.assign({ data: obj }, log));

    return await findById(obj.id, log);
  }, log);
};

export const findById = async (id: string, log: Log.Context) => {
  return await execute(async (connection) => {
    const res = await connection.execute<MySql.RowDataPacket[]>(
      `SELECT * FROM po WHERE id = ?`,
      [id]
    );

    const rows = res[0];

    if (rows?.length) {
      const obj = rows[0] as PO;

      Log.writeInfo(`DB found po with id: ${id}`, Object.assign({ data: obj }, log));

      return obj;
    } else {
      throw { kind: "not_found", message: `The po with id ${id} was not found.` };
    }
  }, log);
};

export const getAll = async (title: string, log: Log.Context) => {
  return await execute(async (connection) => {
    let query = "SELECT * FROM po";

    if (title) {
      query += ` WHERE title LIKE '%${title}%'`;
    }

    const res = await connection.execute<MySql.RowDataPacket[]>(query);
    const rows = res[0];

    Log.writeInfo("DB pos: ", Object.assign({ data: rows }, log));

    return rows as PO[];
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

    const res = await connection.execute<MySql.ResultSetHeader>(
      "UPDATE po SET title = ?, modified = ?, modifiedby = ? WHERE id = ?",
      [obj.title, obj.modified, obj.modifiedby, id]
    );

    if (res[0].affectedRows === 0) {
      throw { kind: "not_found", message: `The po with id ${id} was not found.` };
    } else {
      Log.writeInfo("DB updated po: ", Object.assign({ data: obj }, log));

      return await findById(id, log);
    }
  }, log);
};

export const remove = async (id: string, log: Log.Context) => {
  return await execute(async (connection) => {
    const res = await connection.execute<MySql.ResultSetHeader>(
      "DELETE FROM po WHERE id = ?",
      [id]
    );

    if (res[0].affectedRows == 0) {
      throw { kind: "not_found", message: `The po with id ${id} was not found.` };
    } else {
      Log.writeInfo(`DB deleted po with id: ${id}`, log);
    }
  }, log);
};
