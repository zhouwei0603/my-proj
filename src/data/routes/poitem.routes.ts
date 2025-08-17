import { randomUUID } from "crypto";
import { Express, Router } from "express";
import * as Log from "../log/log";
import * as POItem from "../models/poitem.model";
import * as Routes from "./routes";

export const initialize = (app: Express) => {
  const router = Router();

  router.post("/", (req, res) => {
    const log: Log.Context = { trackId: randomUUID().toLowerCase() };

    const handler: Parameters<typeof Routes.post>[2] = () => {
      const obj: Parameters<typeof POItem.create>[0] = {
        poid: req.body.poid,
        partid: req.body.partid,
        count: req.body.count,
        createdby: Routes.getUserName(req),
      };
      return POItem.create(obj, log);
    };

    return Routes.post(req, res, handler, log);
  });

  router.get("/", (req, res) => {
    const log: Log.Context = { trackId: randomUUID().toLowerCase() };

    const handler: Parameters<typeof Routes.list>[2] = () => {
      return POItem.getAll(req.query.poid as string, log);
    };

    return Routes.list(req, res, handler, log);
  });

  router.get("/:id", (req, res) => {
    const log: Log.Context = { trackId: randomUUID().toLowerCase() };

    const handler: Parameters<typeof Routes.get>[2] = () => {
      return POItem.findById(req.params.id, log);
    };

    return Routes.get(req, res, handler, log);
  });

  router.put("/:id", (req, res) => {
    const log: Log.Context = { trackId: randomUUID().toLowerCase() };

    const handler: Parameters<typeof Routes.put>[2] = () => {
      const obj: Parameters<typeof POItem.updateById>[1] = {
        poid: req.body.poid,
        partid: req.body.partid,
        count: req.body.count,
        modifiedby: Routes.getUserName(req),
      };
      return POItem.updateById(req.params.id, obj, log);
    };

    return Routes.put(req, res, handler, log);
  });

  router.delete("/:id", (req, res) => {
    const log: Log.Context = { trackId: randomUUID().toLowerCase() };

    const handler: Parameters<typeof Routes.remove>[2] = () => {
      return POItem.remove(req.params.id, log);
    };

    return Routes.remove(req, res, handler, log);
  });

  app.use("/api/poitems", router);
};
