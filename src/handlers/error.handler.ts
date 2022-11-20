import { Response } from 'express-serve-static-core'
import { exitHandler, ExitHandler } from './exit.handler'
import { NextFunction, Request } from 'express'
import { HttpBaseException, HttpCode } from '../exceptions/http-base.exception'
import { AppBaseException } from '../exceptions/app-base.exception'
import Logger from '../core/logger'

export class ErrorHandler {
  constructor(private readonly exitHandler: ExitHandler) {}

  public handle(
    error: Error,
    _request: Request,
    response: Response,
    _next: NextFunction
  ): void {
    this.handleError(error, response)
  }

  public handleError(error: Error, response?: Response): void {
    Logger.error(error)
    if (this.isTrustedError(error) && response !== undefined) {
      this.handleTrustedError(error as HttpBaseException, response)
    } else {
      this.handleUntrustedError(error, response)
    }
  }

  private handleTrustedError(
    error: HttpBaseException,
    response: Response
  ): void {
    response.status(error.statusCode).json({ description: error.description })
  }

  public handleUntrustedError(
    _error: Error | AppBaseException,
    response?: Response
  ): void {
    if (response !== undefined) {
      response.status(HttpCode.INTERNAL_SERVER_ERROR)
      response.json({ description: 'Internal server error' })
    }
    Logger.error('Application encountered a critical error. Exiting')
    void this.exitHandler.handleExit(1)
  }

  public isTrustedError(error: Error): boolean {
    return error instanceof HttpBaseException && error.isOperational
  }
}

export const errorHandler = new ErrorHandler(exitHandler)
