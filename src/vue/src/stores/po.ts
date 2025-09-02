import * as core from "./core";
import * as _ from "lodash";

export function get(id: string) {
  return core.get<PO>(`/pos/${id}`);
}

export function list() {
  return core.list<PO>(`/pos`).then(res => res.value || []);
}

export function create(
  content: Readonly<
    Omit<PO, "id" | "created" | "createdby" | "modified" | "modifiedby">
  >
) {
  return core.post<PO>(`/pos`, content);
}

export function update(
  id: string,
  content: Readonly<
    Omit<PO, "id" | "created" | "createdby" | "modified" | "modifiedby">
  >
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
  createdby: string;
  modified?: string;
  modifiedby?: string;
}
