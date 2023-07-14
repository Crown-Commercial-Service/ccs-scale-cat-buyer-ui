type QueryParams = string | string[][] | Record<string, string> | URLSearchParams

type FormatURLParams = {
  baseURL: string
  path: string
  params?: { [key: string]: string }
  queryParams?: QueryParams
}

type FormatRelativeURLParams = {
  path: string
  params?: { [key: string]: string }
  queryParams?: QueryParams
}

export { QueryParams, FormatURLParams, FormatRelativeURLParams };
