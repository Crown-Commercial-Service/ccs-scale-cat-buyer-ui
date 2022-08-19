export interface Search_Highlight {
    frameworkName: string,
    id: string,
    lot: string,
    lotName: string,
    serviceBenefits: string,
    serviceCategories: string,
    serviceDescription: string,
    serviceFeatures: string,
    serviceName: string,
    supplierName: string,
    serviceBenefitsList: string[],
    serviceCategoriesList: string[],
    serviceFeaturesList: string[]
}

export interface ServiceModel {
    dmagg_lot: string,
    dmagg_serviceCategories: string[],
    dmfilter_educationPricing: string,
    dmfilter_emailOrTicketingSupport: string,
    dmfilter_governmentSecurityClearances: string[],
    dmfilter_lot: string,
    dmfilter_phoneSupport: string,
    dmfilter_resellingType: string,
    dmfilter_serviceCategories: string[],
    dmfilter_staffSecurityClearanceChecks: string[],
    dmfilter_webChatSupport: string,
    dmtext_frameworkName: string,
    dmtext_id: string,
    dmtext_lot: string,
    dmtext_lotName: string,
    dmtext_serviceBenefits: string[],
    dmtext_serviceCategories: string[],
    dmtext_serviceDescription: string,
    dmtext_serviceFeatures: string[],
    dmtext_serviceName: string,
    dmtext_supplierName: string,
    sortonly_serviceIdHash: string

}



