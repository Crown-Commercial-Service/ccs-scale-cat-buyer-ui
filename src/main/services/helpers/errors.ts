import { HTTPMethod } from '../types/helpers/api';

class FetchError extends Error {
  constructor(method: HTTPMethod, url: string, status: number) {
    super(`The call ${method} ${url} returned an unexpected status: ${status}`);
  }
}

class FetchTimeoutError extends Error {
  constructor(method: HTTPMethod, url: string, timoutMs: number) {
    const timeoutSeconds = (timoutMs / 1000).toFixed(2);

    super(`The call ${method} ${url} did not respond within ${timeoutSeconds}`);
  }
}

export { FetchError, FetchTimeoutError };
