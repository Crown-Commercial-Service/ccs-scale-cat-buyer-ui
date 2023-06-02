import { FetchResult, FetchResultStatus } from '../types/helpers/api';
import { FetchGetError, FetchPostError } from './errors';
import { formatURL } from './url';

const genericFetch = async <T>(fetchOptions: RequestInit, errorClass: typeof FetchGetError | typeof FetchPostError, baseURL: string, path: string, params?: Array<[string, string]>, queryParams?: { [key: string]: string }): Promise<FetchResult<T>> => {
  try {
    const url: string = formatURL(baseURL, path, params, queryParams);

    const response = await fetch(url, fetchOptions);

    if (response.status !== 200) {
      throw new errorClass(baseURL + path, response.status);
    }

    return {
      status: FetchResultStatus.OK,
      data: await response.json()
    };
  } catch(error) {
    return {
      status: FetchResultStatus.ERROR,
      error: error
    };
  }
};

const genericFecthGet = async <T>(baseURL: string, path: string, headers: {[key: string]: string}, params?: Array<[string, string]>, queryParams?: { [key: string]: string }): Promise<FetchResult<T>> => {
  return genericFetch<T>(
    {
      method: 'GET',
      headers: headers
    },
    FetchGetError,
    baseURL,
    path,
    params,
    queryParams
  );
};

const genericFecthPost = async <T>(baseURL: string, path: string, headers: {[key: string]: string}, data?: {[key: string]: string}, params?: Array<[string, string]>, queryParams?: { [key: string]: string }): Promise<FetchResult<T>> => {
  return genericFetch<T>(
    {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data ?? {})
    },
    FetchPostError,
    baseURL,
    path,
    params,
    queryParams
  );
};

export { genericFecthGet, genericFecthPost };
