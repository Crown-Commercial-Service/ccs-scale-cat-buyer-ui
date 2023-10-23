import { DefaultBodyType, StrictRequest } from 'msw';

const mswJSONResponse = <T>(data: T): Response => {
  return new Response(
    JSON.stringify(data),
    {
      headers: {
        'Content-Type': 'application/json',
      },
      status: 200
    }
  );
};

const mswEmptyResponseWithStatus = (status: number): Response => {
  return new Response(null, { status: status });
};

const matchHeaders = (req: StrictRequest<DefaultBodyType>, expectedHeaders: { [key: string]: string }): boolean => {
  return Object.entries(expectedHeaders).every(([key, value]) => {
    return req.headers.get(key) === value;
  });
};

const matchJSON = async (req: StrictRequest<DefaultBodyType>, expectedJSON: any): Promise<boolean> => {
  return JSON.stringify(await req.json()) === JSON.stringify(expectedJSON);
};

const matchText = async (req: StrictRequest<DefaultBodyType>, expectedText: string): Promise<boolean> => {
  return await req.text() === expectedText;
};

const matchQueryParams = (req: StrictRequest<DefaultBodyType>, expectedQueryParams: string): boolean => {
  return new URL(req.url).search === expectedQueryParams;
};

export { mswJSONResponse, mswEmptyResponseWithStatus, matchHeaders, matchJSON, matchText, matchQueryParams };
