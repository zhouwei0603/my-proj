import * as core from "./core";
import * as _ from "lodash";

export async function get(id: string) {
  const response = await core.get<DBPO>(`/pos/${id}`);
  return {
    ...response,
    createdBy: response.createdby,
    modifiedBy: response.modifiedby,
  };
}

export async function list(
  options?: Readonly<{ title: string; start: number; size: number }>
): Promise<core.ListResponse<PO>> {
  let title: string;
  let size: number;
  let start: number;
  let paging: boolean;

  if (options) {
    title = options.title;
    size = options.size;
    start = options.start;
    paging = true;
  } else {
    title = "";
    size = 100;
    start = 0;
    paging = false;
  }

  const response: core.ListResponse<DBPO> = { total: 0, value: [] };
  await listCore(response, { title, start, size }, !paging);

  return {
    total: response.total,
    value: response.value.map(item => ({
      ...item,
      createdBy: item.createdby,
      modifiedBy: item.modifiedby,
    })),
  };
}

export function create(content: Readonly<Omit<PO, "id" | "created" | "createdBy" | "modified" | "modifiedBy">>) {
  return core.post<PO>(`/pos`, content);
}

export function update(
  id: string,
  content: Readonly<Omit<PO, "id" | "created" | "createdBy" | "modified" | "modifiedBy">>
) {
  return core.put<PO>(`/pos/${id}`, content);
}

export function remove(id: string) {
  return core.remove(`/pos/${id}`);
}

export interface PO {
  id: string;
  title: string;
  created: string;
  createdBy: string;
  modified?: string;
  modifiedBy?: string;
}

interface DBPO {
  id: string;
  title: string;
  created: string;
  createdby: string;
  modified?: string;
  modifiedby?: string;
}

async function listCore(
  data: { value: DBPO[]; total: number },
  options: Required<Parameters<typeof list>>[0],
  autoQueryNextPage: boolean
) {
  let url = `/pos?start=${options.start}&size=${options.size}`;
  if (options.title) {
    url += `&title=${options.title}`;
  }
  const response = await core.list<DBPO>(url);
  data.total = response.total;
  data.value.push(...response.value);

  if (autoQueryNextPage && data.value.length < response.total) {
    await listCore(
      data,
      {
        ...options,
        start: options.start + options.size,
      },
      autoQueryNextPage
    );
  }
}
