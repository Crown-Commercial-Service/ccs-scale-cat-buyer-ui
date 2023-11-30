enum EndPoints {
  STATUS = '/_status',
  SERVICES_SEARCH = '/services/search',
  SERVICES_AGGREGATIONS = '/services/aggregations'
}

interface GCloudService {
  links: {
    next: string
    prev: string
  }
  meta: {
    query: Record<string, string>
    results_per_page: number
    took: number
    total: number
  }
}

interface GCloudServiceSearchDocument {
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

interface GCloudServiceAggregation {
  lot: Record<string, number>
  serviceCategories?: Record<string, number>
}

type GCloudServiceAggregations = GCloudService & {
  aggregations: GCloudServiceAggregation
}

export { EndPoints, GCloudServiceSearch, GCloudServiceAggregations };
