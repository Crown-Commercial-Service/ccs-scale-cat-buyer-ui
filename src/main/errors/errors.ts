import { HttpStatusCode } from './httpStatusCodes';

interface ViewError {
  statusCode: number;
  associatedView?: string;
}

export class NotFoundError extends Error implements ViewError {
  statusCode: number = HttpStatusCode.NOT_FOUND;
  associatedView = '/404';

  constructor(pageUrl: string) {
    super(`Page Not Found, request path: "${pageUrl}"`);
  }
}

export class InternalServerError extends Error implements ViewError {
  statusCode: number = HttpStatusCode.INTERNAL_SERVER;
  associatedView = '/500';

  constructor() {
    super('Internal Server error');
  }
}

export class ForbiddenError extends Error implements ViewError {
  statusCode: number = HttpStatusCode.FORBIDDEN_ACCESS;
  associatedView = 'forbidden';

  constructor() {
    super('You are not allowed to access this resource');
  }
}

export class UnauthorizedError extends Error implements ViewError {
  statusCode: number = HttpStatusCode.UNAUTHORIZED;
  associatedView = '/401';

  constructor() {
    super('You are not allowed to access this resource');
  }
}

export class HTTPError extends Error {
  status: number;
}
