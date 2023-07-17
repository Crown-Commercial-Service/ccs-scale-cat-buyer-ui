import { DefaultBodyType, PathParams, RestRequest } from 'msw';

const matchHeaders = (req: RestRequest<DefaultBodyType, PathParams<string>>, expectedHeaders: { [key: string]: string }): boolean => {
  return Object.entries(expectedHeaders).every(([key, value]) => {
    return req.headers.get(key) === value;
  });
};

const matchJSON = async (req: RestRequest<DefaultBodyType, PathParams<string>>, expectedJSON: any): Promise<boolean> => {
  return JSON.stringify(await req.json()) === JSON.stringify(expectedJSON);
};

const matchText = async (req: RestRequest<DefaultBodyType, PathParams<string>>, expectedText: string): Promise<boolean> => {
  return await req.text() === expectedText;
};

const matchQueryParams = (req: RestRequest<DefaultBodyType, PathParams<string>>, expectedQueryParams: string): boolean => {
  return req.url.search === expectedQueryParams;
};

export { matchHeaders, matchJSON, matchText, matchQueryParams };
