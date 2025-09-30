export function get<T>(relativeUrl: string, source: DataSource = DataSource.Production): Promise<T> {
  return execute({ relativeUrl, source })
}

export function list<T>(relativeUrl: string, source: DataSource = DataSource.Production): Promise<ListResponse<T>> {
  return execute({ relativeUrl, source })
}

export interface ListResponse<T> {
  total: number;
  value: T[];
}

export const enum DataSource {
  User = "User",
  Production = "Production"
}

async function execute<T>(options: { relativeUrl: string, source: DataSource }): Promise<T> {
  try {
    // TODO: remove the delay in production
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const dataEndpoint = dataSourceEndpoint.get(options.source)

    return new Promise<T>((resolve, reject) => {
      wx.request({
        url: `${dataEndpoint}/${options.relativeUrl}`,
        method: "GET",
        header: {
          Accept: "application/json",
        },
        success(res) {
          resolve(res.data as any)
        },
        fail(err) {
          reject(err)
        },
      })
    })
  } catch (error: any) {
    console.error(JSON.stringify(error, undefined, 2))

    if (isKnownError(error)) {
      throw error
    } else {
      throw { message: "An unknown error occurred." }
    }
  }
}

function isKnownError(error: any): boolean {
  const obj: KnownError = error
  return obj.code != null && obj.status != null && obj.message != null && obj.stackTrace != null
}

interface KnownError {
  code: string;
  status: number;
  message: string;
  stackTrace: string;
}

const userDataEndpoint: string = "http://localhost:6666/api"

const productionDataEndpoint: string = "http://localhost:8686/api"

const dataSourceEndpoint: ReadonlyMap<DataSource, string> = new Map<DataSource, string>([[DataSource.User, userDataEndpoint], [DataSource.Production, productionDataEndpoint]])