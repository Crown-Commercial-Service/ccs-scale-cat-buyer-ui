enum EndPoints {
  STATUS = '/_status',
  FILTERS = '/g-cloud-filters'
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type GCloudFilterQueryParams = {
  lot: string
  serviceCategories: string
  parentCategory: string
}

interface GCloudFilter {
  id: string
  label: string
  name: string
  value: string
  count?: string | number
}

type GCloudFilters = Record<string, Record<string, {
      filters: (GCloudFilter & {
        children?: GCloudFilter[]
        childrenssts?: boolean
        childrens?: GCloudFilter[]
      })[]
      label: string
      slug: string
    }>>;

export { EndPoints, GCloudFilterQueryParams, GCloudFilters };
