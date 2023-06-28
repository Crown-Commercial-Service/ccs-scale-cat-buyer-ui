type FormatURLParams = {
  baseURL: string
  path: string
  params?: { [key: string]: string }
  queryParams?: { [key: string]: string }
}

type FormatRelativeURLParams = {
  path: string
  params?: { [key: string]: string }
  queryParams?: { [key: string]: string }
}

export { FormatURLParams, FormatRelativeURLParams };
