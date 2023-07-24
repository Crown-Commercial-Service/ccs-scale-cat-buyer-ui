import { FormatURLParams, FormatRelativeURLParams } from '../types/helpers/url';

const baseFormatURL = (options: FormatURLParams): URL => {
  const { baseURL, params, queryParams } = options;
  let { path } = options;

  if (options.params) {
    Object.entries(params).forEach(([param, value]) => path = path.replace(`:${param}`, value));
  }

  const url = new URL(path, baseURL);

  if (queryParams !== undefined) {
    url.search = (new URLSearchParams(queryParams)).toString();
  }

  return url;
};

/**
 * Formats a URL from the given options
 * @param options 
 * @returns 
 */
const formatURL = (options: FormatURLParams): string => {
  return baseFormatURL(options).toString();
};

/**
 * Formats a relative URL from the given options
 * @param options 
 * @returns 
 */
const formatRelativeURL = (options: FormatRelativeURLParams): string => {
  const url = baseFormatURL({ baseURL: 'https://www.crowncommercial.gov.uk', ...options });

  return `${url.pathname}${url.search}`;
};

export { formatURL, formatRelativeURL };
