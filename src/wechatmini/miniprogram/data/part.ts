import * as core from "./core"

export function get(id: string) {
  return core.get<Part>(`/parts/${id}`)
}

export async function list(
  options?: Readonly<{ name: string; start: number; size: number }>
): Promise<core.ListResponse<Part>> {
  const result: core.ListResponse<Part> = { total: 0, value: [] }

  let name: string
  let size: number
  let start: number
  let paging: boolean

  if (options) {
    name = options.name
    size = options.size
    start = options.start
    paging = true;
  } else {
    name = ""
    size = 100
    start = 0
    paging = false
  }

  await listCore(result, { name, start, size }, !paging)

  return result
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
  let url = `/parts?start=${options.start}&size=${options.size}`
  if (options.name) {
    url += `&name=${options.name}`
  }
  const response = await core.list<Part>(url)
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
