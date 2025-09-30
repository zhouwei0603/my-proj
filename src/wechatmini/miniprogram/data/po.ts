import * as core from "./core"

export function get(id: string): Promise<PO> {
  return core.get<PO>(`/pos/${id}`)
}

export async function list(
  options?: Readonly<{ title: string; start: number; size: number }>
): Promise<core.ListResponse<PO>> {
  let title: string
  let size: number
  let start: number
  let paging: boolean

  if (options) {
    title = options.title
    size = options.size
    start = options.start
    paging = true
  } else {
    title = ""
    size = 100
    start = 0
    paging = false
  }

  const response: core.ListResponse<PO> = { total: 0, value: [] }
  await listCore(response, { title, start, size }, !paging)

  return response
}

export interface PO {
  id: string;
  title: string;
  created: string;
  createdBy: string;
  modified?: string;
  modifiedBy?: string;
}

async function listCore(
  data: { value: PO[]; total: number },
  options: Required<Parameters<typeof list>>[0],
  autoQueryNextPage: boolean
) {
  let url = `/pos?start=${options.start}&size=${options.size}`
  if (options.title) {
    url += `&title=${options.title}`
  }
  const response = await core.list<PO>(url)
  data.total = response.total
  data.value.push(...response.value)

  if (autoQueryNextPage && data.value.length < response.total) {
    await listCore(
      data,
      {
        ...options,
        start: options.start + options.size,
      },
      autoQueryNextPage
    )
  }
}
