type EndPoints = {
  filters: string
}

type GCloudFilterQueryParams = {
  lot: string
  serviceCategories: string
  parentCategory: string
}

type GCloudFilter = {
  id: string
  label: string
  name: string
  value: string
}

type GCloudFilters = {
  [key: string]: {
    [key: string]: {
      filters: GCloudFilter[]
      label: string
      slug: string
    }
  } 
}

export { EndPoints, GCloudFilterQueryParams, GCloudFilters };
