enum HTTPMethod {
  GET = 'GET',
  POST = 'POST'
}

type CacheOptions = {
  key: string
  seconds: number
}

interface FetchRequestInit extends Omit<RequestInit, 'method'> {
  method: HTTPMethod
}

enum FetchResultStatus {
  OK = 0,
  ERROR = 1
}

type FetchResultOK<T> = {
  status: FetchResultStatus.OK
  data: T
}

type FetchResultError = {
  status: FetchResultStatus.ERROR
  error: any
}

type BaseFetchResult<T> = FetchResultOK<T> | FetchResultError

type FetchResult<T> = BaseFetchResult<T> & {
  unwrap: () => T
}

export { HTTPMethod, CacheOptions, FetchRequestInit, BaseFetchResult, FetchResult, FetchResultStatus, FetchResultOK, FetchResultError };