import { Request, Response, NextFunction } from 'express'
import { RateLimiterMiddleware } from './rate-limiter.middleware'
import { RequestStore } from '../interfaces/request-store.interface'
import { TooManyRequestHttpException } from '../exceptions/too-many-request-http.exception'

describe('rate limiter middleware', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let nextFunction: NextFunction
  let middleware: RateLimiterMiddleware
  let mockRequestStore: RequestStore

  beforeEach(() => {
    nextFunction = jest.fn()
    mockResponse = {
      locals: { ip: '1.1.1.1' },
      header: jest.fn(),
    }

    mockRequestStore = {
      remaining: jest.fn(),
      getFirstRequestTimestamp: jest.fn(),
    }

    middleware = new RateLimiterMiddleware(mockRequestStore, {
      rateLimit: 10,
      identifierGenerator: (request, response) => response.locals.ip,
    })
  })

  it('should not throw an error if the request limit is not reached', async () => {
    jest.spyOn(mockRequestStore, 'remaining').mockResolvedValue(2)

    await middleware.handle(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    )

    expect(nextFunction).toBeCalledWith()
  })

  it('should add the headers RateLimit-Limit and RateLimit-Remaining', async () => {
    jest.spyOn(mockRequestStore, 'remaining').mockResolvedValue(2)
    const header = jest.spyOn(mockResponse, 'header')

    await middleware.handle(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    )

    expect(header).toBeCalledWith('RateLimit-Limit', '10')
    expect(header).toBeCalledWith('RateLimit-Remaining', '2')

    expect(nextFunction).toBeCalledWith()
  })

  it('should add the headers RateLimit-Limit, RateLimit-Remaining and RateLimit-Reset', async () => {
    const remaining = jest
      .spyOn(mockRequestStore, 'remaining')
      .mockResolvedValue(0)
    const getFirstRequestTimestamp = jest
      .spyOn(mockRequestStore, 'getFirstRequestTimestamp')
      .mockResolvedValue(100_000)

    const header = jest.spyOn(mockResponse, 'header')

    await middleware.handle(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    )

    expect(remaining).toBeCalledWith('1.1.1.1', 10, 3600000)
    expect(getFirstRequestTimestamp).toBeCalledWith('1.1.1.1')

    expect(header).toBeCalledWith('RateLimit-Limit', '10')
    expect(header).toBeCalledWith('RateLimit-Remaining', '0')
    expect(header).toBeCalledWith('RateLimit-Reset', '3700000')

    expect(nextFunction).toBeCalledWith(
      new TooManyRequestHttpException(10, 3700000)
    )
  })

  it('should handle the error in case of unhandled exception', async () => {
    jest.spyOn(mockRequestStore, 'remaining').mockRejectedValue(new Error())

    await middleware.handle(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    )

    expect(nextFunction).toBeCalledWith(new Error())
  })
})
