import * as core from "./core";
import * as _ from "lodash";

export function get(id: string) {
  return core.get<POItem>(`/poitems/${id}`);
}

export function list() {
  return core.list<POItem>(`/poitems`).then(res => res.value || []);
}

export function create(
  content: Readonly<
    Omit<POItem, "id" | "created" | "createdby" | "modified" | "modifiedby">
  >
) {
  return core.post<POItem>(`/poitems`, content);
}

export function update(
  id: string,
  content: Readonly<
    Omit<POItem, "id" | "created" | "createdby" | "modified" | "modifiedby">
  >
) {
  return core.put<POItem>(`/poitems/${id}`, content);
}

export function remove(id: string) {
  return core.remove(`/poitems/${id}`);
}

export interface POItem {
  id: string;
  poid: string;
  partid: string;
  count: number;
  created: string;
  createdby: string;
  modified?: string;
  modifiedby?: string;
}
