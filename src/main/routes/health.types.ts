type GenericReponse = {
  statusCode: number
}

type TendersServiceReponse = {
  serverError: boolean
}

type DigitalMarketplaceResponse = GenericReponse & {
  body: {
    status: string
  }
}

export { GenericReponse, TendersServiceReponse, DigitalMarketplaceResponse };