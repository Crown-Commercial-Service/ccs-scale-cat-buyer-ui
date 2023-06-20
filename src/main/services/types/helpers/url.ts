
type FormatURLParams = {
  baseURL: string
  path: string
  params?: Array<[string, string]>
  queryParams?: { [key: string]: string }
}

export { FormatURLParams };