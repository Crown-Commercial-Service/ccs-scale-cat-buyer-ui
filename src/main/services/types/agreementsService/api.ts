enum EndPoints {
  STATUS = '/agreements',
  AGREEMENT = '/agreements/:agreementId',
  AGREEMENT_LOTS = '/agreements/:agreementId/lots',
  AGREEMENT_LOT = '/agreements/:agreementId/lots/:lotId',
  AGREEMENT_LOT_SUPPLIERS = '/agreements/:agreementId/lots/:lotId/suppliers',
  AGREEMENT_LOT_EVENT_TYPES = '/agreements/:agreementId/lots/:lotId/event-types'
}

type AgreementLotEventType = {
  type: string
}

export { EndPoints, AgreementLotEventType };
