import { Response } from 'express-serve-static-core'
import { exitHandler } from './exit.handler'
import { Application, NextFunction, Request } from 'express'
import Logger from './logger'
import { HttpBaseException, HttpCode } from '../exceptions/http-base.exception'
import { AppBaseException } from '../exceptions/app-base.exception'

export class ErrorHandler {
  public handle(express: Application): Application {
    Logger.info('Application :: Booting - Error handlers')
    express.use(
      (err: Error, _req: Request, res: Response, _next: NextFunction) => {
        this.handleError(err, res)
      }
    )
    return express
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
      response.json({ message: 'Internal server error' })
    }
    Logger.error('Application encountered a critical error. Exiting')
    void exitHandler.handleExit(1)
  }

  public isTrustedError(error: Error): boolean {
    if (error instanceof HttpBaseException) {
      return error.isOperational
    }
    return false
  }
}
