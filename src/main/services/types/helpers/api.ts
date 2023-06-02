enum FetchResultStatus {
  OK = 0,
  ERROR = 1
}

type FetchResult<T> = {
  status: FetchResultStatus
  data?: T
  error?: any
}

export { FetchResult, FetchResultStatus };
