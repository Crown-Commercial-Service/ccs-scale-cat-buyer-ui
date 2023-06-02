class GenericFetchError extends Error {
  constructor(method: string, url: string, status: number) {
    super(`The call ${method} ${url} returned an unexpected status: ${status}`);
  }
}

class FetchGetError extends GenericFetchError {
  constructor(url: string, status: number) {
    super('GET', url, status);
  }
}

class FetchPostError extends GenericFetchError {
  constructor(url: string, status: number) {
    super('POST', url, status);
  }
}

export { FetchGetError, FetchPostError };
