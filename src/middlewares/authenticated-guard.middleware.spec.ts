import { Request, Response, NextFunction } from 'express'
import { AuthenticatedGuardMiddleware } from './authenticated-guard.middleware'
import { AuthService } from '../core/auth.service'
import { ForbiddenHttpException } from '../exceptions/forbidden-http.exception'

describe('authenticated guard middleware', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let nextFunction: NextFunction = jest.fn()
  let authService: AuthService
  let middleware: AuthenticatedGuardMiddleware

  beforeEach(() => {
    mockRequest = {
      headers: { authorization: 'Bearer token' },
    }
    mockResponse = {
      locals: {},
    }

    authService = {
      verify: jest.fn(),
    } as unknown as AuthService

    middleware = new AuthenticatedGuardMiddleware(authService)
  })

  it('Should verify the token and save uuid in response.locals.user', async () => {
    jest
      .spyOn(authService, 'verify')
      .mockImplementation(() => Promise.resolve({ uuid: 'test-uuid' }))

    await middleware.handle(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    )

    expect(mockResponse?.locals?.user).toBe('test-uuid')
  })

  it('Should throw an error if the verification fails', async () => {
    jest
      .spyOn(authService, 'verify')
      .mockImplementation(() => Promise.reject(new Error()))

    await middleware.handle(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    )

    expect(nextFunction).toBeCalledWith(new ForbiddenHttpException())
  })
})
