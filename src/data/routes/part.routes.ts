import { randomUUID } from "crypto";
import { Express, Router } from "express";
import * as Log from "../log/log";
import * as Part from "../models/part.model";
import * as Routes from "./routes";

export const initialize = (app: Express) => {
  const router = Router();

  router.post("/", (req, res) => {
    const log: Log.Context = { trackId: randomUUID().toLowerCase() };

    const handler: Parameters<typeof Routes.post>[2] = () => {
      const obj: Parameters<typeof Part.create>[0] = {
        name: req.body.name,
      };
      return Part.create(obj, log);
    };

    return Routes.post(req, res, handler, log);
  });

  router.get("/", (req, res) => {
    const log: Log.Context = { trackId: randomUUID().toLowerCase() };

    const handler: Parameters<typeof Routes.list>[2] = () => {
      const name = req.query.name as string;
      return Part.getAll(name, Routes.convertListQueryToDbParams(req.query), log);
    };

    return Routes.list(req, res, handler, log);
  });

  router.get("/:id", (req, res) => {
    const log: Log.Context = { trackId: randomUUID().toLowerCase() };

    const handler: Parameters<typeof Routes.get>[2] = () => {
      return Part.findById(req.params.id, log);
    };

    return Routes.get(req, res, handler, log);
  });

  router.put("/:id", (req, res) => {
    const log: Log.Context = { trackId: randomUUID().toLowerCase() };

    const handler: Parameters<typeof Routes.put>[2] = () => {
      const obj: Parameters<typeof Part.updateById>[1] = {
        name: req.body.name,
      };
      return Part.updateById(req.params.id, obj, log);
    };

    return Routes.put(req, res, handler, log);
  });

  router.delete("/:id", (req, res) => {
    const log: Log.Context = { trackId: randomUUID().toLowerCase() };

    const handler: Parameters<typeof Routes.remove>[2] = () => {
      return Part.remove(req.params.id, log);
    };

    return Routes.remove(req, res, handler, log);
  });

  app.use("/api/parts", router);
};
