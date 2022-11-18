import Logger from './logger'
import Server from '../server'

class ExitHandler {
  public async handleExit(code: number, timeout = 5000): Promise<void> {
    try {
      Logger.warn(`Attempting a graceful shutdown with code ${code}`)

      setTimeout(() => {
        Logger.warn(`Forcing a shutdown with code ${code}`)
        process.exit(code)
      }, timeout).unref()

      await Server.shutdown()

      Logger.warn(`Exiting gracefully with code ${code}`)
      process.exit(code)
    } catch (error) {
      Logger.error('Error shutting down gracefully')
      if (error instanceof Error) {
        Logger.error(error)
      }
      Logger.warn(`Forcing exit with code ${code}`)
      process.exit(code)
    }
  }
}

export const exitHandler = new ExitHandler()
