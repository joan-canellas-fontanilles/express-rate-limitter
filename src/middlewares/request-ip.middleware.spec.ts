import { Request, Response, NextFunction } from 'express'
import { RequestIpMiddleware } from './request-ip.middleware'

describe('request ip middleware', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let nextFunction: NextFunction = jest.fn()
  let middleware: RequestIpMiddleware

  beforeEach(() => {
    mockResponse = {
      locals: {},
    }

    middleware = new RequestIpMiddleware()
  })

  it('Should store in locals the forwarded ip', async () => {
    mockRequest = {
      headers: { ['x-forwarded-for']: '1.1.1.1' },
    }

    await middleware.handle(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    )
    expect(mockResponse?.locals?.ip).toBe('1.1.1.1')
  })

  it('Should store in locals the first forwarded ip', async () => {
    mockRequest = {
      headers: {
        ['x-forwarded-for']: ['1.1.1.1', '1.2.3.4'],
      },
    }

    await middleware.handle(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    )
    expect(mockResponse?.locals?.ip).toBe('1.1.1.1')
  })

  it('Should store in locals the first forwarded ip', async () => {
    mockRequest = {
      headers: { ['x-forwarded-for']: undefined },
      socket: {
        remoteAddress: '1.1.1.1',
      },
    } as unknown as Request

    await middleware.handle(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    )
    expect(mockResponse?.locals?.ip).toBe('1.1.1.1')
  })
})
