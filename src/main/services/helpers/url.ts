import { FormatURLParams } from '../types/helpers/url';

/**
 * Formats a URL from the given options
 * @param options 
 * @returns 
 */
const formatURL = (options: FormatURLParams): string => {
  const { baseURL, params, queryParams } = options;
  let { path } = options;

  if (options.params) {
    params.forEach(([param, value]) => path = path.replace(param, value));
  }

  const url = new URL(path, baseURL);

  if (queryParams !== undefined) {
    url.search = (new URLSearchParams(queryParams)).toString();
  }

  return url.toString();
};

export { formatURL };
