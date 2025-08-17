import * as core from "./core";
import * as _ from "lodash";

export function get(id: string) {
  return core.get<Part>(`/parts/${id}`);
}

export function list() {
  return core.list<Part>(`/parts`).then((res) => {
    const promise = new Promise<Part[]>((resolve) => {
      _.delay(() => resolve(res), 1000);
    });
    return promise;
  });
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
