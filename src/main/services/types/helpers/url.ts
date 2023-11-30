type QueryParams = string | string[][] | Record<string, string> | URLSearchParams

interface FormatURLParams {
  baseURL: string
  path: string
  params?: Record<string, string>
  queryParams?: QueryParams
}

interface FormatRelativeURLParams {
  path: string
  params?: Record<string, string>
  queryParams?: QueryParams
}

export { QueryParams, FormatURLParams, FormatRelativeURLParams };
