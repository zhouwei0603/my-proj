import axios, { AxiosError } from "axios";
import * as _ from "lodash";

const dataEndpoint: string = import.meta.env.VITE_DATA_PARTY_ENDPOINT;

console.log(`Data endpoint: ${dataEndpoint}`);

export async function get<T>(relativeUrl: string) {
  return execute(async () => {
    const { data } = await getInstance(relativeUrl).get<T>(relativeUrl);
    return data;
  });
}

export async function list<T>(relativeUrl: string) {
  return execute(async () => {
    const { data } = await getInstance(relativeUrl).get<ListResponse<T>>(
      relativeUrl
    );
    return data;
  });
}

export async function post<T>(relativeUrl: string, content?: any) {
  return execute(async () => {
    const { data } = await getInstance(relativeUrl, content).post<T>(
      relativeUrl,
      content
    );
    return data;
  });
}

export async function patch<T>(relativeUrl: string, content?: any) {
  return execute(async () => {
    const { data } = await getInstance(relativeUrl, content).patch<T>(
      relativeUrl,
      content
    );
    return data;
  });
}

export async function put<T>(relativeUrl: string, content?: any) {
  return execute(async () => {
    const { data } = await getInstance(relativeUrl, content).put<T>(
      relativeUrl,
      content
    );
    return data;
  });
}

export async function remove(relativeUrl: string) {
  return execute(async () => {
    await getInstance(relativeUrl).delete(relativeUrl);
  });
}

export type Error = Pick<AxiosError, "code" | "status" | "message">;

export interface ListResponse<T> {
  total: number;
  value: T[];
}

function getInstance(relativeUrl: string, content?: any) {
  if (_.isNil(content)) {
    return withoutContentInstance;
  } else {
    return withContentInstance;
  }
}

const withContentInstance = axios.create({
  baseURL: dataEndpoint,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

const withoutContentInstance = axios.create({
  baseURL: dataEndpoint,
  headers: {
    Accept: "application/json",
  },
});

function execute<T>(action: () => Promise<T>) {
  try {
    return action();
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const data = {
        code: error.code,
        status: error.status,
        message: error.message,
        stackTrace: error.stack,
      };

      console.error(JSON.stringify(data), undefined, 2);

      throw data;
    } else {
      if (_.isPlainObject(error)) {
        console.error(JSON.stringify(error, undefined, 2));
      } else {
        console.error(error);
      }

      throw { message: "An unknown error occurred." };
    }
  }
}
