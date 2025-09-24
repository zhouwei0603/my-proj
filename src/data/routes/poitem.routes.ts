import { randomUUID } from "crypto";
import { Express, Router } from "express";
import * as Log from "../log/log";
import * as DBPOItem from "../models/poitem.model";
import * as Routes from "./routes";

export const initialize = (app: Express) => {
  const router = Router();

  router.post("/", (req, res) => {
    const log: Log.Context = { trackId: randomUUID().toLowerCase() };

    const handler: Parameters<typeof Routes.post>[2] = async () => {
      const obj: Parameters<typeof DBPOItem.create>[0] = {
        poid: req.body.poid,
        partid: req.body.partid,
        count: req.body.count,
        createdby: Routes.getUserName(req),
      };
      const response = await DBPOItem.create(obj, log);
      return normalize(response);
    };

    return Routes.post(req, res, handler, log);
  });

  router.get("/", (req, res) => {
    const log: Log.Context = { trackId: randomUUID().toLowerCase() };

    const handler: Parameters<typeof Routes.list>[2] = async () => {
      const response = await DBPOItem.getAll(req.query.poid as string, Routes.convertListQueryToDbParams(req.query), log);
      const data: Routes.ListResponse<POItem> = {
        total: response.total,
        value: response.value.map((r) => {
          return normalize(r as any);
        }),
      };
      return data;
    };

    return Routes.list(req, res, handler, log);
  });

  router.get("/:id", (req, res) => {
    const log: Log.Context = { trackId: randomUUID().toLowerCase() };

    const handler: Parameters<typeof Routes.get>[2] = async () => {
      const response = await DBPOItem.findById(req.params.id, log);
      return normalize(response);
    };

    return Routes.get(req, res, handler, log);
  });

  router.put("/:id", (req, res) => {
    const log: Log.Context = { trackId: randomUUID().toLowerCase() };

    const handler: Parameters<typeof Routes.put>[2] = async () => {
      const obj: Parameters<typeof DBPOItem.updateById>[1] = {
        poid: req.body.poid,
        partid: req.body.partid,
        count: req.body.count,
        modifiedby: Routes.getUserName(req),
      };
      const response = await DBPOItem.updateById(req.params.id, obj, log);
      return normalize(response);
    };

    return Routes.put(req, res, handler, log);
  });

  router.delete("/:id", (req, res) => {
    const log: Log.Context = { trackId: randomUUID().toLowerCase() };

    const handler: Parameters<typeof Routes.remove>[2] = () => {
      return DBPOItem.remove(req.params.id, log);
    };

    return Routes.remove(req, res, handler, log);
  });

  app.use("/api/poitems", router);
};

function normalize(db: DBPOItem.POItem): POItem {
  const data = {
    ...db,
    createdBy: db.createdby,
    modifiedBy: db.modifiedby,
  };
  delete data.createdby;
  delete data.modifiedby;
  return data;
}

export interface POItem extends Omit<DBPOItem.POItem, "createdby" | "modifiedby"> {
  createdBy: string;
  modifiedBy?: string;
}
