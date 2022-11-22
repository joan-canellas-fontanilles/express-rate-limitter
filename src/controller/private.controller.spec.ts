import { Request, Response } from 'express'
import { PrivateController } from './private.controller'

describe('Private controller', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>

  beforeEach(() => {
    mockRequest = {}
    mockResponse = {
      json: jest.fn(),
    }
  })

  it('Should send a message', () => {
    const controller = new PrivateController()

    const response = {
      message: 'Message response for the private route',
    }

    controller.sendMessage(mockRequest as Request, mockResponse as Response)

    expect(mockResponse.json).toBeCalledWith(response)
  })
})
