const formatURL = (baseURL: string, path: string, params?: Array<[string, string]>, queryParams?: { [key: string]: string }): string => {
  if (params) {
    params.forEach(([param, value]) => path = path.replace(param, value));
  }

  const url = new URL(path, baseURL);

  if (queryParams !== undefined) {
    url.search = (new URLSearchParams(queryParams)).toString();
  }

  return url.toString();
};

export { formatURL };