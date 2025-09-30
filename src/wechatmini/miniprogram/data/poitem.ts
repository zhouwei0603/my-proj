import * as core from "./core"

export function get(id: string): Promise<POItem> {
  return core.get<POItem>(`/poitems/${id}`)
}

export async function list(
  poid: string,
  options?: Readonly<{ start: number; size: number }>
): Promise<core.ListResponse<POItem>> {
  let size: number
  let start: number
  let paging: boolean

  if (options) {
    size = options.size
    start = options.start
    paging = true
  } else {
    size = 100
    start = 0
    paging = false
  }

  const response: core.ListResponse<POItem> = { total: 0, value: [] }
  await listCore(poid, response, { start, size }, !paging)

  return response
}

export interface POItem {
  id: string;
  poid: string;
  partid: string;
  count: number;
  created: string;
  createdBy: string;
  modified?: string;
  modifiedBy?: string;
}

async function listCore(
  poid: string,
  data: { value: POItem[]; total: number },
  options: Required<Parameters<typeof list>>[1],
  autoQueryNextPage: boolean
) {
  let url = `/poitems?poid=${poid}&start=${options.start}&size=${options.size}`
  const response = await core.list<POItem>(url)
  data.total = response.total
  data.value.push(...response.value)

  if (autoQueryNextPage && data.value.length < response.total) {
    await listCore(
      poid,
      data,
      {
        ...options,
        start: options.start + options.size,
      },
      autoQueryNextPage
    )
  }
}
