enum EndPoints {
  STATUS = '/_status',
  FILTERS = '/g-cloud-filters'
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
  count?: string | number
}

type GCloudFilters = {
  [key: string]: {
    [key: string]: {
      filters: Array<GCloudFilter & {
        children?: GCloudFilter[]
        childrenssts?: boolean
        childrens?: GCloudFilter[]
      }>
      label: string
      slug: string
    }
  } 
}

export { EndPoints, GCloudFilterQueryParams, GCloudFilters };
