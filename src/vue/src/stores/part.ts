import * as core from "./core";
import _ from "lodash";

export function get(id: string) {
  return core.get<Part>(`/parts/${id}`);
}

export async function list(
  name?: string
): Promise<core.ListResponse<Part>>
export async function list(
  options?: Readonly<{ name?: string; start: number; size: number }>
): Promise<core.ListResponse<Part>>
export async function list(
  params?: string | Readonly<{ name?: string; start: number; size: number }>
): Promise<core.ListResponse<Part>> {
  const result: core.ListResponse<Part> = { total: 0, value: [] };

  let name: string;
  let size: number;
  let start: number;
  let paging: boolean;

  if (_.isNil(params)) {
    name = "";
    size = 100;
    start = 0;
    paging = false;
  } else if (_.isString(params)) {
    name = params;
    size = 100;
    start = 0;
    paging = false;
  } else {
    name = params.name || "";
    size = params.size;
    start = params.start;
    paging = true;
  }

  await listCore(result, { name, start, size }, !paging);

  return result;
}

export function create(content: Readonly<Omit<Part, "id">>) {
  return core.post<Part>(`/parts`, content);
}

export function update(id: string, content: Readonly<Omit<Part, "id">>) {
  return core.put<Part>(`/parts/${id}`, content);
}

export function remove(id: string) {
  return core.remove(`/parts/${id}`);
}

export interface Part {
  id: string;
  name: string;
}

async function listCore(
  data: { value: Part[]; total: number },
  options: Required<Parameters<typeof list>>[0],
  autoQueryNextPage: boolean
) {
  let url = `/parts?start=${options.start}&size=${options.size}`;
  if (options.name) {
    url += `&name=${options.name}`;
  }
  const response = await core.list<Part>(url);
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
