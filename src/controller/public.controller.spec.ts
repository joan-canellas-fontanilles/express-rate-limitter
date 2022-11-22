import { Request, Response } from 'express'
import { PublicController } from './public.controller'

describe('Public controller', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>

  beforeEach(() => {
    mockRequest = {}
    mockResponse = {
      json: jest.fn(),
    }
  })

  it('Should send a message', () => {
    const controller = new PublicController()

    const response = {
      message: 'Message response for the public route',
    }

    controller.sendMessage(mockRequest as Request, mockResponse as Response)

    expect(mockResponse.json).toBeCalledWith(response)
  })
})
