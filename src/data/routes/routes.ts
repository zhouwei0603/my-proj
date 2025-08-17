import { Request, Response } from "express";
import * as Http from "http";
import { isPromise } from "node:util/types";
import * as Log from "../log/log";
import * as Db from "../models/db";

export const getUserName = (req: Request) => req.headers.authorization || "";

export type Create = () => Promise<any>;
export type Get = () => Promise<any>;
export type List = () => Promise<any[]>;
export type Update = () => Promise<any>;
export type Remove = () => Promise<void>;
export type Validate = () => Promise<string[]> | string[];

export const post = async (
  req: Request,
  res: Response,
  create: Create,
  log: Log.Context,
  validate?: Validate
) => {
  const ctx = createRequestContext(req, log);
  Log.writeInfo(`Begin post.`, ctx);

  let data: any;
  let code: number;

  try {
    const error = await validateCore(req, ctx, validate);

    if (error) {
      code = 400;
      data = error;
    } else {
      code = 200;
      data = await create();
      removeNull(data);
    }
  } catch (err) {
    code = handleError(err);
    data = err;
  } finally {
    const ctx = createResponseContext(res, log, data);
    if (code >= 400) {
      Log.writeError(`End post with error.`, ctx);
    } else {
      Log.writeInfo(`End post.`, ctx);
    }

    res.status(code).send(data);
  }
};

export const get = async (
  req: Request<Readonly<{ id: string }>>,
  res: Response,
  get: Get,
  log: Log.Context,
  validate?: Validate
) => {
  const ctx = createRequestContext(req, log);
  Log.writeInfo(`Begin get.`, ctx);

  let data: any;
  let code: number;

  try {
    const error = await validateCore(req, ctx, validate);

    if (error) {
      code = 400;
      data = error;
    } else {
      code = 200;
      data = await get();
      removeNull(data);
    }
  } catch (err) {
    code = handleError(err);
    data = err;
  } finally {
    const ctx = createResponseContext(res, log, data);
    if (code >= 400) {
      Log.writeError(`End get with error.`, ctx);
    } else {
      Log.writeInfo(`End get.`, ctx);
    }

    res.status(code).send(data);
  }
};

export const list = async (
  req: Request,
  res: Response,
  list: List,
  log: Log.Context,
  validate?: Validate
) => {
  const ctx = createRequestContext(req, log);
  Log.writeInfo(`Begin list.`, ctx);

  let data: any;
  let code: number;

  try {
    const error = await validateCore(req, ctx, validate);

    if (error) {
      code = 400;
      data = error;
    } else {
      code = 200;
      data = await list();
      removeNull(data);
      data = {
        value: data,
      };
    }
  } catch (err) {
    code = handleError(err);
    data = err;
  } finally {
    const ctx = createResponseContext(res, log, data);
    if (code >= 400) {
      Log.writeError(`End list with error.`, ctx);
    } else {
      Log.writeInfo(`End list.`, ctx);
    }

    res.status(code).send(data);
  }
};

export const put = async (
  req: Request<Readonly<{ id: string }>>,
  res: Response,
  update: Update,
  log: Log.Context,
  validate?: Validate
) => {
  const ctx = createRequestContext(req, log);
  Log.writeInfo(`Begin put.`, ctx);

  let data: any;
  let code: number;

  try {
    const error = await validateCore(req, ctx, validate);

    if (error) {
      code = 400;
      data = error;
    } else {
      code = 200;
      data = await update();
      removeNull(data);
    }
  } catch (err) {
    code = handleError(err);
    data = err;
  } finally {
    const ctx = createResponseContext(res, log, data);
    if (code >= 400) {
      Log.writeError(`End put with error.`, ctx);
    } else {
      Log.writeInfo(`End put.`, ctx);
    }

    res.status(code).send(data);
  }
};

export const remove = async (
  req: Request<Readonly<{ id: string }>>,
  res: Response,
  remove: Remove,
  log: Log.Context,
  validate?: Validate
) => {
  const ctx = createRequestContext(req, log);
  Log.writeInfo(`Begin delete.`, ctx);

  let data: any;
  let code: number;

  try {
    const error = await validateCore(req, ctx, validate);

    if (error) {
      code = 400;
      data = error;
    } else {
      code = 200;
      await remove();
    }
  } catch (err) {
    code = handleError(err);
    data = err;
  } finally {
    const ctx = createResponseContext(res, log, data);
    if (code >= 400) {
      Log.writeError(`End delete with error.`, ctx);
    } else {
      Log.writeInfo(`End delete.`, ctx);
    }

    res.status(code).send(data);
  }
};

const validateCore = async (
  req: Request,
  ctx: RouteRequestContext,
  validate?: Validate,
  options?: Readonly<{ validateBody: boolean }>
) => {
  try {
    Log.writeInfo("Begin validation", {
      trackId: ctx.trackId,
    });

    let body: {
      message: string;
    };

    if (options?.validateBody) {
      if (!req.headers.body) {
        body = {
          message: "Content can not be empty!",
        };
      }
    }

    if (!body && validate) {
      let errors: string[];

      const validation = validate();

      if (isPromise(validation)) {
        errors = await validation;
      } else {
        errors = validation;
      }

      if (errors?.length > 0) {
        body = {
          message: errors[0],
        };
      }
    }

    return body;
  } finally {
    Log.writeInfo("End validation", {
      trackId: ctx.trackId,
    });
  }
};

const removeNull = (data: any) => {
  for (const key in data) {
    if (data[key] === null || data[key] === undefined) {
      delete data[key];
    } else if (typeof data[key] === "object") {
      removeNull(data[key]);
    }
  }
};

const handleError = (err: Db.DbError) => {
  const e = err as Db.DbError;

  switch (e.kind) {
    case "not_found": {
      return 404;
    }

    default: {
      return 500;
    }
  }
};

const createRequestContext = (req: Request, log: Log.Context) => {
  const headers = Object.assign({}, req.headers);
  delete headers.authorization;

  const ctx: RouteRequestContext = {
    trackId: log.trackId,
    uri: req.originalUrl,
    body: req.body,
    method: req.method,
    headers: headers,
  };

  return ctx;
};

const createResponseContext = (
  res: Response,
  log: Log.Context,
  code: number,
  body?: any
) => {
  const headers = Object.assign({}, res.getHeaders());
  delete headers.authorization;

  const ctx: RouteResponseContext = {
    trackId: log.trackId,
    body,
    code,
    headers,
  };

  return ctx;
};

interface RouteRequestContext extends Log.Context {
  uri: string;
  headers: NodeJS.Dict<string | string[]>;
  body: any;
  method: string;
}

interface RouteResponseContext extends Log.Context {
  headers: Http.OutgoingHttpHeaders;
  body: any;
  code: number;
}
