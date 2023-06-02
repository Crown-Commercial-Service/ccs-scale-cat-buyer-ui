type EndPoints = {
  service: string
  supplier: string
  supplierFramework: string
}

type GCloudService = {
  serviceMadeUnavailableAuditEvent: string | null
  services: {
    [key: string]: boolean | number | string | string[] | object
  }
}

type GCloudSupplier = {
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
    service_counts: {
      [key: string]: number
    }
    tradingStatus: string
    vatNumber: string
  }
}

type GCloudSupplierFramework = {
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
