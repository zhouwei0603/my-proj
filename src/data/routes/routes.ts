import { Request, Response } from "express";
import * as Http from "http";
import { isPromise } from "node:util/types";
import * as Log from "../log/log";
import * as Db from "../models/db";

export const getUserName = (req: Request) => req.headers.authorization || "";

export type Create = () => Promise<any>;
export type Get = () => Promise<any>;
export type List = () => Promise<{ total: number; value: any[] }>;
export type Update = () => Promise<any>;
export type Remove = () => Promise<void>;
export type Validate = () => Promise<string | string[] | null | undefined> | string | string[] | null | undefined;

export interface Query {
  apiVersion?: string;
}

export interface Params {}

export interface PostParams extends Params {}

export interface PostQuery extends Query {}

export interface GetParams extends Params {
  id: string;
}

export interface GetQuery extends Query {}

export interface ListParams extends Params {}

export interface ListQuery extends Query {
  start?: string;
  end?: string;
  size?: string;
}

export interface PutParams extends Params {
  id: string;
}

export interface PutQuery extends Query {}

export interface DeleteParams extends Params {
  id: string;
}

export interface DeleteQuery extends Query {}

export type PostRequest = Request<Readonly<PostParams>, any, any, Readonly<PostQuery>>;
export type GetRequest = Request<Readonly<GetParams>, any, any, Readonly<GetQuery>>;
export type ListRequest = Request<Readonly<ListParams>, any, any, Readonly<ListQuery>>;
export type PutRequest = Request<Readonly<PutParams>, any, any, Readonly<PutQuery>>;
export type DeleteRequest = Request<Readonly<DeleteParams>, any, any, Readonly<DeleteQuery>>;

export type DataRequest = PostRequest | GetRequest | ListRequest | PutRequest | DeleteRequest;

export const post = async (req: PostRequest, res: Response, create: Create, log: Log.Context, validate?: Validate) => {
  const ctx = createRequestContext(req, log);
  Log.writeInfo(`Begin post.`, ctx);

  let data: any;
  let code: number;

  try {
    const error = await validateCore(req, ctx, [validate]);

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

export const get = async (req: GetRequest, res: Response, get: Get, log: Log.Context, validate?: Validate) => {
  const ctx = createRequestContext(req, log);
  Log.writeInfo(`Begin get.`, ctx);

  let data: any;
  let code: number;

  try {
    const error = await validateCore(req, ctx, [
      validate,
      () => {
        if (!req.params.id) {
          return "The parameter 'id' is required.";
        }
      },
    ]);

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

export const list = async (req: ListRequest, res: Response, list: List, log: Log.Context, validate?: Validate) => {
  const ctx = createRequestContext(req, log);
  Log.writeInfo(`Begin list.`, ctx);

  let data: any;
  let code: number;

  try {
    const error = await validateCore(req, ctx, [
      validate,
      () => {
        if (!checkIfInteger(req.query.start)) {
          return "The query 'start' is not a valid integer.";
        }

        if (req.query.end !== undefined && req.query.size !== undefined) {
          return "You can only use one of the query 'end' or 'size', but not both.";
        }

        if (!checkIfInteger(req.query.end)) {
          return "The query 'end' is not a valid integer.";
        }

        if (!checkIfInteger(req.query.size)) {
          return "The query 'size' is not a valid integer.";
        }

        let start = req.query.start === undefined ? 0 : parseInt(req.query.start);

        if (start < 0) {
          return "The parameter 'start' must be greater than or equal to zero.";
        }

        let end: number;

        if (req.query.end === undefined) {
          if (req.query.size === undefined) {
            end = start + 99;
          } else {
            end = start + parseInt(req.query.size) - 1;
          }
        } else {
          end = parseInt(req.query.end);
        }

        if (end < start) {
          return "The parameter 'end' cannot be less than 'start'.";
        }

        const size = end - start + 1;

        if (size > 100) {
          return "The size cannot be greater than 100.";
        }
      },
    ]);

    if (error) {
      code = 400;
      data = error;
    } else {
      code = 200;
      data = await list();
      removeNull(data);
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

export const put = async (req: PutRequest, res: Response, update: Update, log: Log.Context, validate?: Validate) => {
  const ctx = createRequestContext(req, log);
  Log.writeInfo(`Begin put.`, ctx);

  let data: any;
  let code: number;

  try {
    const error = await validateCore(req, ctx, [
      validate,
      () => {
        if (!req.params.id) {
          return "The parameter 'id' is required.";
        }
      },
    ]);

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
  req: DeleteRequest,
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
    const error = await validateCore(req, ctx, [
      validate,
      () => {
        if (!req.params.id) {
          return "The parameter 'id' is required.";
        }
      },
    ]);

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

export const convertListQueryToDbParams = (query: ListQuery): Db.GetAllParams => {
  const params: Db.GetAllParams = {
    end: typeof query.end === "undefined" ? undefined : parseInt(query.end),
    size: typeof query.size === "undefined" ? undefined : parseInt(query.size),
    start: typeof query.start === "undefined" ? undefined : parseInt(query.start),
  };

  return params;
}

const validateCore = async (
  req: DataRequest,
  ctx: RouteRequestContext,
  validators: Validate[],
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

    if (!body && validators.length) {
      for (let i = 0; i < validators.length; ++i) {
        const validate = validators[i];

        //// The validator array item may be null or undefined
        if (validate) {
          let errors: string[];

          const v = validate();

          if (isPromise(v)) {
            const r = await v;
            if (typeof r === "string") {
              errors = [r];
            } else {
              errors = r;
            }
          } else {
            if (typeof v === "string") {
              errors = [v];
            } else {
              errors = v;
            }
          }

          if (errors?.length > 0) {
            body = {
              message: errors[0],
            };

            //// We only need the first error, so stop loop for performance.
            break;
          }
        }
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

const createRequestContext = (req: DataRequest, log: Log.Context) => {
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

const createResponseContext = (res: Response, log: Log.Context, code: number, body?: any) => {
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

const checkIfInteger = (value?: string) => {
  return value === undefined || Number.isInteger(Number(value));
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
