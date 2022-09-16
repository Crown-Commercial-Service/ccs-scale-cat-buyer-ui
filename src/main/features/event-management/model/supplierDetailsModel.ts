export interface SupplierDetails {
    supplierName: string,
    supplierAddress: SupplierAddress,
    supplierContactName: string,
    supplierContactEmail: string,
    supplierWebsite: string,
    supplierId: string,
    supplierIdMain :string,
    eventId: string,
    supplierOrganisation: string,
    responseState: string,
    responseDate: string,
    score: string,
    rank: string,
    supplierState: string,
    supplierAwardedDate: string,
    supplierSignedContractDate: string,
    supplierFeedBack: string,
    supplierStandStillDate : string,
    standStillFlag : boolean,
    rankFlag : boolean,
}

export interface SupplierAddress {
    streetAddress: string,
    locality: string,
    region: string,
    postalCode: string,
    countryName: string,
    countryCode: string
}

export interface DocumentTemplate {
    supplierName: string,
    supplierId: string,
    templateId: string,
    templatesFileName: string,
    templatesDescription: string,
    templatesOrder: string,
    documentTemplates: string,
    documentTemplatesUnSuccess: string,
    templatesFileSize: string
}