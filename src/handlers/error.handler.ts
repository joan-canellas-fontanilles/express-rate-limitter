import { Response } from 'express-serve-static-core'
import { exitHandler, ExitHandler } from './exit.handler'
import { NextFunction, Request } from 'express'
import { HttpBaseException, HttpCode } from '../exceptions/http-base.exception'
import { AppBaseException } from '../exceptions/app-base.exception'
import { logger } from '../core/logger'
import { ApplicationLogger } from '../interfaces/application-logger.interface'

export class ErrorHandler {
  constructor(
    private readonly logger: ApplicationLogger,
    private readonly exitHandler: ExitHandler
  ) {}

  public handle(
    error: Error,
    _request: Request,
    response: Response,
    _next: NextFunction
  ): void {
    this.handleError(error, response)
  }

  public handleError(error: Error, response?: Response): void {
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
    this.logger.info(error)
    response.status(error.statusCode).json({ description: error.description })
  }

  private handleUntrustedError(
    error: Error | AppBaseException,
    response?: Response
  ): void {
    this.logger.error(error)
    if (response !== undefined) {
      response.status(HttpCode.INTERNAL_SERVER_ERROR)
      response.json({ description: 'Internal server error' })
    }
    this.logger.error('Application encountered a critical error. Exiting')
    void this.exitHandler.handleExit(1)
  }

  private isTrustedError(error: Error): boolean {
    return error instanceof HttpBaseException && error.isOperational
  }
}

export const errorHandler = new ErrorHandler(logger, exitHandler)
