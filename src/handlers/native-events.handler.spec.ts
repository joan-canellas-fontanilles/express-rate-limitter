import { NativeEventsHandler } from './native-events.handler'
import { ErrorHandler } from './error.handler'
import { ApplicationLogger } from '../interfaces/application-logger.interface'
import { ExitHandler } from './exit.handler'

describe('Native events handler', () => {
  let nativeEventHandler: NativeEventsHandler
  let logger: ApplicationLogger
  let errorHandler: ErrorHandler
  let exitHandler: ExitHandler

  beforeEach(() => {
    errorHandler = {
      handleError: jest.fn(),
    } as unknown as ErrorHandler

    exitHandler = {
      handleExit: jest.fn(),
    } as unknown as ExitHandler

    logger = {
      warn: jest.fn(),
      info: jest.fn(),
      error: jest.fn(),
    }

    nativeEventHandler = new NativeEventsHandler(
      errorHandler,
      exitHandler,
      logger
    )

    nativeEventHandler.handle()
  })

  it('Should handle the error on uncaughtException', () => {
    const handleError = jest.spyOn(errorHandler, 'handleError')
    process.emit('uncaughtException', new Error())
    expect(handleError).toBeCalledWith(new Error())
  })

  it('Should handle exit if SIGTERM signal is received', () => {
    const handleExit = jest.spyOn(exitHandler, 'handleExit')
    process.emit('SIGTERM')
    expect(handleExit).toBeCalledWith(0)
  })

  it('Should handle exit if SIGINT signal is received', () => {
    const handleExit = jest.spyOn(exitHandler, 'handleExit')
    process.emit('SIGINT')
    expect(handleExit).toBeCalledWith(0)
  })
})
