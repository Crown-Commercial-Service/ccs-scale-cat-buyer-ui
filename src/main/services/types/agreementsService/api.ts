enum EndPoints {
  STATUS = '/agreements-service/health',
  AGREEMENT = '/agreements-service/agreements/:agreementId',
  AGREEMENT_LOTS = '/agreements-service/agreements/:agreementId/lots',
  AGREEMENT_LOT = '/agreements-service/agreements/:agreementId/lots/:lotId',
  AGREEMENT_LOT_SUPPLIERS = '/agreements-service/agreements/:agreementId/lots/:lotId/suppliers',
  AGREEMENT_LOT_EVENT_TYPES = '/agreements-service/agreements/:agreementId/lots/:lotId/event-types',
}

interface AgreementLotEventType {
  type: string
}

type AgreementServiceHealthResponse = {
  status: string
}

export { EndPoints, AgreementLotEventType, AgreementServiceHealthResponse };
