interface GenericReponse {
  statusCode: number
}

interface TendersServiceReponse {
  serverError: boolean
}

type DigitalMarketplaceResponse = GenericReponse & {
  body: {
    status: string
  }
}

export { GenericReponse, TendersServiceReponse, DigitalMarketplaceResponse };