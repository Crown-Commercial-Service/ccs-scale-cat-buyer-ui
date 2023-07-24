import { BaseFetchResult, FetchRequestInit, FetchResult, FetchResultStatus, HTTPMethod } from '../types/helpers/api';
import { CacheOptions } from '../types/helpers/cache';
import { LoggerOptions } from '../types/helpers/performanceLogger';
import { FormatURLParams } from '../types/helpers/url';
import { getCachedData, setCachedData } from './chache';
import { FetchError, FetchTimeoutError } from './errors';
import { getPerformanceLogger } from './performanceLogger';
import { formatURL } from './url';

/**
 * If the result status is 'error' it will throw an exception,
 * otherwise it returns the data
 * @param result
 * @returns
 */
const unwrap = <T>(result: BaseFetchResult<T>): T => {
  if (result.status === FetchResultStatus.ERROR) {
    throw result.error;
  }

  return result.data;
};

/**
 * Calls the NODE Fetch API and timeout if the request takes too long,
 * otherwise it returns the response
 * @param fetchOptions 
 * @param urlParams 
 * @param timeout 
 * @returns 
 */
const fetchWithOptionalTimeout = async (fetchOptions: FetchRequestInit, urlParams: FormatURLParams, timeout?: number): Promise<Response> => {
  const url: string = formatURL(urlParams);
  let id: NodeJS.Timeout;

  if (timeout !== undefined) {
    const controller = new AbortController();
    id = setTimeout(() => controller.abort(new FetchTimeoutError(fetchOptions.method, urlParams.baseURL + urlParams.path, timeout)), timeout);

    fetchOptions.signal = controller.signal;
  }

  const response = await fetch(url, fetchOptions);

  if (id !== undefined) {
    clearTimeout(id);
  }

  return response;
};

/**
 * Makes a call with the NODE Fetch API and
 * retuns an FetchResultOK if there are no errors,
 * otherwise it returns a FetchResultError 
 * @param fetchOptions 
 * @param urlParams 
 * @param timeout 
 * @returns 
 */
const genericFetch = async <T>(fetchOptions: FetchRequestInit, urlParams: FormatURLParams, cacheOptions?: CacheOptions, loggerOptions?: LoggerOptions, timeout?: number): Promise<FetchResult<T>> => {
  let result: BaseFetchResult<T>;

  const performanceLogger = getPerformanceLogger(loggerOptions);

  try {
    let responseData: T;

    performanceLogger.startTimer();
 
    if (cacheOptions) {
      responseData = await getCachedData(cacheOptions.key);
    }

    if (!responseData) {
      const response = await fetchWithOptionalTimeout(fetchOptions, urlParams, timeout);

      if (response.status !== 200) {
        throw new FetchError(
          fetchOptions.method,
          urlParams.baseURL + urlParams.path,
          response.status
        );
      }

      responseData = await response.json();

      if (cacheOptions) {
        await setCachedData(responseData, cacheOptions);
      }
    }

    performanceLogger.endTimerAndLogResult();

    result = {
      status: FetchResultStatus.OK,
      data: responseData,
    };
  } catch (error) {
    result = {
      status: FetchResultStatus.ERROR,
      error: error,
    };
  }

  return {
    ...result,
    unwrap: () => unwrap<T>(result)
  };
};

/**
 * Makes a GET request with the NODE Fetch API
 * @param urlParams 
 * @param headers 
 * @param timeout 
 * @returns 
 */
const genericFecthGet = async <T>(urlParams: FormatURLParams, headers: { [key: string]: string }, cacheOptions?: CacheOptions, loggerOptions?: LoggerOptions, timeout?: number): Promise<FetchResult<T>> => {
  return genericFetch<T>(
    {
      method: HTTPMethod.GET,
      headers: headers
    },
    urlParams,
    cacheOptions,
    loggerOptions,
    timeout
  );
};

/**
 * Makes a POST request with the NODE Fetch API
 * @param urlParams 
 * @param headers 
 * @param data 
 * @param timeout 
 * @returns 
 */
const genericFecthPost = async <T>(urlParams: FormatURLParams, headers: { [key: string]: string }, data?: { [key: string]: string }, loggerOptions?: LoggerOptions, timeout?: number): Promise<FetchResult<T>> => {
  return genericFetch<T>(
    {
      method: HTTPMethod.POST,
      headers: headers,
      body: JSON.stringify(data ?? {})
    },
    urlParams,
    undefined,
    loggerOptions,
    timeout
  );
};

export { genericFecthGet, genericFecthPost };
