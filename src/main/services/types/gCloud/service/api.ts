import { ServiceModel } from 'main/features/g-cloud/model/searchModel';

enum EndPoints {
  STATUS = '/_status',
  SERVICE = '/services/:serviceId',
  SUPPLIER = '/suppliers/:supplierId',
  SUPPLIER_FRAMEWORK = '/suppliers/:supplierId/frameworks/g-cloud-13'
}

interface GCloudService {
  serviceMadeUnavailableAuditEvent: string | null
  services: ServiceModel
}

interface GCloudSupplier {
  suppliers: {
    companiesHouseNumber: string
    companyDetailsConfirmed: boolean
    contactInformation: [
      {
        address1: string
        city: string
        contactName: string
        email: string
        id: number
        links: {
          self: string
        }
        personalDataRemoved: boolean
        phoneNumber: string
        postcode: string
      }
    ]
    description: string
    dunsNumber: string
    id: number
    links: {
      self: string
    }
    name: string
    organisationSize: string
    registeredName: string
    registrationCountry: string
    service_counts: Record<string, number>
    tradingStatus: string
    vatNumber: string
  }
}

interface GCloudSupplierFramework {
  frameworkInterest: {
    agreedVariations: object
    agreementDetails: {
      frameworkAgreementVersion: string
      signerName: string
      signerRole: string
      uploaderUserEmail: string
      uploaderUserId: number
      uploaderUserName: string
    }
    agreementId: number
    agreementPath: string | null,
    agreementReturned: boolean
    agreementReturnedAt: string
    agreementStatus: string
    allowDeclarationReuse: boolean
    applicationCompanyDetailsConfirmed: boolean
    countersigned: boolean
    countersignedAt: string
    countersignedDetails: {
      approvedByUserEmail: string
      approvedByUserId: number
      approvedByUserName: string
      countersignerName: string
      countersignerRole: string
    }
    countersignedPath: string
    declaration: {
      modernSlaveryStatement: string
      modernSlaveryStatementOptional: string
      [key: string]: string | boolean
    }
    frameworkFamily: string
    frameworkFramework: string
    frameworkSlug: string
    onFramework: boolean
    prefillDeclarationFromFrameworkSlug: string
    supplierId: number
    supplierName: string
  }
}

export { EndPoints, GCloudService, GCloudSupplier, GCloudSupplierFramework };
