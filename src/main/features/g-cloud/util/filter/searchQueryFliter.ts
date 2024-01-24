import { Request } from 'express';
import sanitizeHtml from 'sanitize-html';

enum QueryParamType {
  AGGREGATIONS,
  SEARCH,
  SEARCH_URL
}

const skipFilter = (key: string, type: QueryParamType): boolean => {
  switch(type) {
    case QueryParamType.AGGREGATIONS:
      return key === 'page' || key === 'parentCategory';
    case QueryParamType.SEARCH:
      return key === 'parentCategory';
    case QueryParamType.SEARCH_URL:
      return key === 'page';
  }
};

const extractQueryParamsForSearchAPI = (query: Request['query'], type: QueryParamType, withFilterPrefix = true): string[][] => {
  const queryParams: string[][] = [];
  const prefix = withFilterPrefix ? 'filter_' : '';

  Object.entries(query).forEach(([key, values]) => {
    if (skipFilter(key, type)) return;

    if (key === 'q' ) {
      queryParams.push([key, sanitizeHtml(values as string)]);
    } else if (key === 'page') {
      queryParams.push([key, values as string]);
    } else {
      const newKey = `${prefix}${key}`;

      if (Array.isArray(values)) {
        values.forEach((value) => {
          queryParams.push([newKey, value as string]);
        });
      } else {
        queryParams.push([newKey, values as string]);
      }
    }
  });

  return queryParams;
};

export { QueryParamType, extractQueryParamsForSearchAPI };
