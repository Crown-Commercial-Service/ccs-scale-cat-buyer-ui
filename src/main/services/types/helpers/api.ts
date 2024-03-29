enum HTTPMethod {
  GET = 'GET',
  POST = 'POST'
}

interface FetchRequestInit extends Omit<RequestInit, 'method'> {
  method: HTTPMethod
}

enum FetchResultStatus {
  OK = 0,
  ERROR = 1
}

interface FetchResultOK<T> {
  status: FetchResultStatus.OK
  data: T
}

interface FetchResultError {
  status: FetchResultStatus.ERROR
  error: any
}

type BaseFetchResult<T> = FetchResultOK<T> | FetchResultError

type FetchResult<T> = BaseFetchResult<T> & {
  unwrap: () => T
}

export { HTTPMethod, FetchRequestInit, BaseFetchResult, FetchResult, FetchResultStatus, FetchResultOK, FetchResultError };
