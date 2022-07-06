export interface SupplierDetails {
    supplierName: string,
    supplierAddress: string,
    supplierContactName: string,
    supplierContactEmail: string,
    supplierWebsite: string,
    supplierId: string,
    supplierOrganisation: string,
    responseState: string,
    responseDate: string,
    score: string,
    rank: string,

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