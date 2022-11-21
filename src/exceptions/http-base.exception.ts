import { AppBaseException } from './app-base.exception'

export enum HttpCode {
  OK = 200,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  TOO_MANY_REQUEST = 429,
  INTERNAL_SERVER_ERROR = 500,
}

export abstract class HttpBaseException extends AppBaseException {
  protected constructor(
    isOperational: boolean,
    description: string,
    public readonly statusCode: HttpCode
  ) {
    super(undefined, isOperational, description)
    Object.setPrototypeOf(this, new.target.prototype)
  }
}
