import { Request, Response, NextFunction } from 'express'
import { NotFoundController } from './not-found.controller'
import { NotFoundHttpException } from '../exceptions/not-found-http.exception'

describe('Not found controller', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let nextFunction: NextFunction = jest.fn()

  beforeEach(() => {
    mockRequest = {
      method: 'GET',
      originalUrl: 'not-found',
    }
    mockResponse = {
      json: jest.fn(),
    }
  })

  it('Should throw an error', () => {
    const controller = new NotFoundController()

    controller.throwError(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    )

    expect(nextFunction).toBeCalledWith(
      new NotFoundHttpException('GET', 'not-found')
    )
  })
})
