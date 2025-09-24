import { randomUUID } from "crypto";
import { Express, Router } from "express";
import * as Log from "../log/log";
import * as DBPO from "../models/po.model";
import * as Routes from "./routes";

export const initialize = (app: Express) => {
  const router = Router();

  router.post("/", (req, res) => {
    const log: Log.Context = { trackId: randomUUID().toLowerCase() };

    const handler: Parameters<typeof Routes.post>[2] = async () => {
      const obj: Parameters<typeof DBPO.create>[0] = {
        title: req.body.title,
        createdby: Routes.getUserName(req),
      };
      const response = await DBPO.create(obj, log);
      return normalize(response);
    };

    return Routes.post(req, res, handler, log);
  });

  router.get("/", (req, res) => {
    const log: Log.Context = { trackId: randomUUID().toLowerCase() };

    const handler: Parameters<typeof Routes.list>[2] = async () => {
      const title = req.query.title as string;
      const response = await DBPO.getAll(title, Routes.convertListQueryToDbParams(req.query), log);
      const data: Routes.ListResponse<PO> = {
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
      const response = await DBPO.findById(req.params.id, log);
      return normalize(response);
    };

    return Routes.get(req, res, handler, log);
  });

  router.put("/:id", (req, res) => {
    const log: Log.Context = { trackId: randomUUID().toLowerCase() };

    const handler: Parameters<typeof Routes.put>[2] = async () => {
      const obj: Parameters<typeof DBPO.updateById>[1] = {
        title: req.body.title,
        modifiedby: Routes.getUserName(req),
      };
      const response = await DBPO.updateById(req.params.id, obj, log);
      return normalize(response);
    };

    return Routes.put(req, res, handler, log);
  });

  router.delete("/:id", (req, res) => {
    const log: Log.Context = { trackId: randomUUID().toLowerCase() };

    const handler: Parameters<typeof Routes.remove>[2] = () => {
      return DBPO.remove(req.params.id, log);
    };

    return Routes.remove(req, res, handler, log);
  });

  app.use("/api/pos", router);
};

function normalize(db: DBPO.PO): PO {
  const data = {
    ...db,
    createdBy: db.createdby,
    modifiedBy: db.modifiedby,
  };
  delete data.createdby;
  delete data.modifiedby;
  return data;
}

export interface PO extends Omit<DBPO.PO, "createdby" | "modifiedby"> {
  createdBy: string;
  modifiedBy?: string;
}
