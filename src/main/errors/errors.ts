import {HttpStatusCode} from './HttpStatusCode'

interface ViewError {
  statusCode: number
  associatedView?: string
}

export class NotFoundError extends Error implements ViewError {
  statusCode: number = HttpStatusCode.NOT_FOUND
  associatedView: string = 'error/404'

  constructor () {
    super(`Page Not Found`)
  }
}

export class InternalServerError extends Error implements ViewError {
    statusCode: number = HttpStatusCode.INTERNAL_SERVER
    associatedView: string = 'error/500'
  
    constructor () {
      super(`Page Not Found`)
    }
  }

export class ForbiddenError extends Error implements ViewError {
  statusCode: number = HttpStatusCode.FORBIDDEN_ACCESS
  associatedView: string = 'forbidden'

  constructor () {
    super(`You are not allowed to access this resource`)
  }
}

export class HTTPError extends Error {
    status: number;
  }
