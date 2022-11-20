import { ExitHandler, exitHandler } from './exit.handler'
import { UnhandledRejectionException } from '../exceptions/unhandled-rejection.exception'
import { errorHandler, ErrorHandler } from './error.handler'
import Logger from '../core/logger'

class NativeEventsHandler {
  constructor(
    private readonly errorHandler: ErrorHandler,
    private readonly exitHandler: ExitHandler
  ) {}

  public handle(): void {
    process.on('uncaughtException', (error) => {
      this.errorHandler.handleError(error)
    })

    process.on('unhandledRejection', (reason: Error | any) => {
      throw new UnhandledRejectionException(reason.message ?? reason)
    })

    process.on('SIGTERM', () => {
      Logger.info(
        `Process ${process.pid} received SIGTERM: Exiting with code 0`
      )
      void this.exitHandler.handleExit(0)
    })

    process.on('SIGINT', () => {
      Logger.info(`Process ${process.pid} received SIGINT: Exiting with code 0`)
      void this.exitHandler.handleExit(0)
    })
  }
}

export const nativeEventHandler = new NativeEventsHandler(
  errorHandler,
  exitHandler
)
