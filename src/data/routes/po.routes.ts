import { randomUUID } from "crypto";
import { Express, Router } from "express";
import * as Log from "../log/log";
import * as PO from "../models/po.model";
import * as Routes from "./routes";

export const initialize = (app: Express) => {
  const router = Router();

  router.post("/", (req, res) => {
    const log: Log.Context = { trackId: randomUUID().toLowerCase() };

    const handler: Parameters<typeof Routes.post>[2] = () => {
      const obj: Parameters<typeof PO.create>[0] = {
        title: req.body.title,
        createdby: Routes.getUserName(req),
      };
      return PO.create(obj, log);
    };

    return Routes.post(req, res, handler, log);
  });

  router.get("/", (req, res) => {
    const log: Log.Context = { trackId: randomUUID().toLowerCase() };

    const handler: Parameters<typeof Routes.list>[2] = () => {
      const title = req.query.title as string;
      return PO.getAll(title, Routes.convertListQueryToDbParams(req.query), log);
    };

    return Routes.list(req, res, handler, log);
  });

  router.get("/:id", (req, res) => {
    const log: Log.Context = { trackId: randomUUID().toLowerCase() };

    const handler: Parameters<typeof Routes.get>[2] = () => {
      return PO.findById(req.params.id, log);
    };

    return Routes.get(req, res, handler, log);
  });

  router.put("/:id", (req, res) => {
    const log: Log.Context = { trackId: randomUUID().toLowerCase() };

    const handler: Parameters<typeof Routes.put>[2] = () => {
      const obj: Parameters<typeof PO.updateById>[1] = {
        title: req.body.title,
        modifiedby: Routes.getUserName(req),
      };
      return PO.updateById(req.params.id, obj, log);
    };

    return Routes.put(req, res, handler, log);
  });

  router.delete("/:id", (req, res) => {
    const log: Log.Context = { trackId: randomUUID().toLowerCase() };

    const handler: Parameters<typeof Routes.remove>[2] = () => {
      return PO.remove(req.params.id, log);
    };

    return Routes.remove(req, res, handler, log);
  });

  app.use("/api/pos", router);
};
