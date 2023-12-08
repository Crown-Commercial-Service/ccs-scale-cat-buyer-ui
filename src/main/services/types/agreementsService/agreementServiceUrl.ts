type AgreementLotSuppliersExportURL = (agreementId: string, lotId: string) => string

type StatusURL = () => string

interface AgreementsServiceURL {
  agreementLotSuppliersExportURL: AgreementLotSuppliersExportURL,
}

type AgreementsServiceV1URL = AgreementsServiceURL & {
  statusURL: StatusURL
}

type AgreementsServiceV2URL = AgreementsServiceURL

export { AgreementsServiceURL, AgreementsServiceV1URL, AgreementsServiceV2URL };
