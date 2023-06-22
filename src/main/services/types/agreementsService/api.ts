enum EndPoints {
  AGREEMENT = '/agreements/:agreement-id',
  AGREEMENT_LOTS = '/agreements/:agreement-id/lots',
  AGREEMENT_LOT = '/agreements/:agreement-id/lots/:lot-id',
  AGREEMENT_LOT_SUPPLIERS = '/agreements/:agreement-id/lots/:lot-id/suppliers',
  AGREEMENT_LOT_EVENT_TYPES = '/agreements/:agreement-id/lots/:lot-id/event-types'
}

type AgreementLotEventType = {
  type: string
}

export { EndPoints, AgreementLotEventType };
