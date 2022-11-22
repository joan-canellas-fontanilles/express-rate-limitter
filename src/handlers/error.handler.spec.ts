import { Response } from 'express'
import { ErrorHandler } from './error.handler'
import { ForbiddenHttpException } from '../exceptions/forbidden-http.exception'
import { ExitHandler } from './exit.handler'
import { ApplicationLogger } from '../interfaces/application-logger.interface'

describe('Error handler', () => {
  let mockResponse: Partial<Response>
  let mockLogger: ApplicationLogger
  let controller: ErrorHandler
  let exitHandler: ExitHandler

  beforeEach(() => {
    mockResponse = {}
    mockResponse.json = jest.fn().mockReturnValue(mockResponse)
    mockResponse.status = jest.fn().mockReturnValue(mockResponse)

    mockLogger = {
      warn: jest.fn(),
      info: jest.fn(),
      error: jest.fn(),
    }
    exitHandler = {
      handleExit: jest.fn(),
    } as unknown as ExitHandler

    controller = new ErrorHandler(mockLogger, exitHandler)
  })

  it('Should return a handled response if it is an operational error', () => {
    const error = new ForbiddenHttpException()
    controller.handleError(error, mockResponse as Response)

    expect(mockResponse.json).toBeCalledWith({
      description: 'The client does not have access rights for this content',
    })
    expect(mockResponse.status).toBeCalledWith(403)
  })

  it('Should return a handled response stop the server if it is not an operational error', () => {
    const error = new Error()
    controller.handleError(error, mockResponse as Response)
    expect(exitHandler.handleExit).toBeCalledWith(1)
  })

  it('Should return a handled response if a response object is sent', () => {
    const error = new Error()
    controller.handleError(error, mockResponse as Response)
    expect(mockResponse.json).toBeCalledWith({
      description: 'Internal server error',
    })
    expect(mockResponse.status).toBeCalledWith(500)
  })
})
