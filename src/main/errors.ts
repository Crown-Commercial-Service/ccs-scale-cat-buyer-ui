interface ViewError {
  statusCode: number
  associatedView?: string
}

export class NotFoundError extends Error implements ViewError {
  statusCode: number = 404
  associatedView: string = 'error/404'

  constructor () {
    super(`Page Not Found`)
  }
}

export class InternalServerError extends Error implements ViewError {
    statusCode: number = 404
    associatedView: string = 'error/500'
  
    constructor () {
      super(`Page Not Found`)
    }
  }

export class ForbiddenError extends Error implements ViewError {
  statusCode: number = 403
  associatedView: string = 'forbidden'

  constructor () {
    super(`You are not allowed to access this resource`)
  }
}

export class HTTPError extends Error {
    status: number;
  }
