jest.mock('../core/logger', () => ({
  CustomLogger: jest.fn().mockImplementation(() => ({
    warn: jest.fn(),
    info: jest.fn(),
    error: jest.fn(),
  })),
}))

jest.mock('../server')

import { CustomLogger } from '../core/logger'
import { ExitHandler } from './exit.handler'
import { EnvironmentProperties } from '../interfaces/environment-properties.interface'
import { server } from '../server'

describe('Exit handler', () => {
  let handler: ExitHandler
  let mockLogger: CustomLogger

  beforeEach(() => {
    mockLogger = new CustomLogger({} as EnvironmentProperties)
    handler = new ExitHandler(mockLogger)
    jest.spyOn(process, 'exit').mockImplementation()
  })

  it('Should stop the server gracefully if everything is okay', async () => {
    jest.spyOn(server, 'shutdown').mockImplementation(() => Promise.resolve())
    await handler.handleExit(1)
    expect(process.exit).toBeCalledWith(1)
  })

  it('Should force an exit if the server is not shutting down', async () => {
    jest.spyOn(server, 'shutdown').mockRejectedValue(new Error())
    await handler.handleExit(1)
    expect(process.exit).toBeCalledWith(1)
  })
})
