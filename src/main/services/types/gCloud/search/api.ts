enum EndPoints {
  SERVICES_SEARCH = '/services/search',
  SERVICES_AGGREGATIONS = '/services/aggregations'
}

type GCloudService = {
  links: {
    next: string
  }
  meta: {
    query: { [key: string]: string }
    results_per_page: number
    took: number
    total: number
  }
}

type GCloudServiceSearchDocument = {
  frameworkName: string
  highlight: {
    frameworkName: [string]
    id: [string]
    lot: [string]
    lotName: [string]
    serviceBenefits: [string]
    serviceCategories: [string]
    serviceDescription: [string]
    serviceFeatures: [string]
    serviceName: [string]
    supplierName: [string]
  }
  id: string
  lot: string
  lotName: string
  serviceBenefits: string[]
  serviceCategories: string[]
  serviceDescription: string
  serviceFeatures: string[]
  serviceName: string
  supplierName: string
}

type GCloudServiceSearch = GCloudService & {
  documents: GCloudServiceSearchDocument[]
}

type GCloudServiceAggregation = {
  lot: {
    [key: string]: number
  }
  serviceCategories?: {
    [key: string]: number
  }
}

type GCloudServiceAggregations = GCloudService & {
  aggregations: GCloudServiceAggregation
}

export { EndPoints, GCloudServiceSearch, GCloudServiceAggregations };
