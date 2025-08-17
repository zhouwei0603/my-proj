import { randomUUID } from "crypto";
import * as MySql from "mysql2";
import * as Log from "../log/log";
import { execute } from "./db";

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

    await connection.execute("INSERT INTO part SET id = ?, name = ?", [
      obj.id,
      obj.name,
    ]);

    Log.writeInfo("DB created part: ", Object.assign({ data: obj }, log));

    return await findById(obj.id, log);
  }, log);
};

export const findById = async (id: string, log: Log.Context) => {
  return await execute(async (connection) => {
    const res = await connection.execute<MySql.RowDataPacket[]>(
      `SELECT * FROM part WHERE id = ?`,
      [id]
    );

    const rows = res[0];

    if (rows?.length) {
      const obj = rows[0] as Part;

      Log.writeInfo(`DB found part with id: ${id}`, Object.assign({ data: obj }, log));

      return obj;
    } else {
      throw { kind: "not_found", message: `The part with id ${id} was not found.` };
    }
  }, log);
};

export const getAll = async (name: string, log: Log.Context) => {
  return await execute(async (connection) => {
    let query = "SELECT * FROM part";

    if (name) {
      query += ` WHERE name LIKE '%${name}%'`;
    }

    const res = await connection.execute<MySql.RowDataPacket[]>(query);
    const rows = res[0];

    Log.writeInfo("DB parts: ", Object.assign({ data: rows }, log));

    return rows as Part[];
  }, log);
};

export const updateById = async (
  id: string,
  part: Omit<Part, "id">,
  log: Log.Context
) => {
  return await execute(async (connection) => {
    const obj: Omit<Part, "id"> = {
      name: part.name,
    };

    const res = await connection.execute<MySql.ResultSetHeader>(
      "UPDATE part SET name = ? WHERE id = ?",
      [obj.name, id]
    );

    if (res[0].affectedRows === 0) {
      throw { kind: "not_found", message: `The part with id ${id} was not found.` };
    } else {
      Log.writeInfo("DB updated part: ", Object.assign({ data: obj }, log));

      return await findById(id, log);
    }
  }, log);
};

export const remove = async (id: string, log: Log.Context) => {
  return await execute(async (connection) => {
    const res = await connection.execute<MySql.ResultSetHeader>(
      "DELETE FROM part WHERE id = ?",
      [id]
    );

    if (res[0].affectedRows == 0) {
      throw { kind: "not_found", message: `The part with id ${id} was not found.` };
    } else {
      Log.writeInfo(`DB deleted part with id: ${id}`, log);
    }
  }, log);
};
