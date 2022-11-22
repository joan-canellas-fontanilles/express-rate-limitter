import { server } from '../server'
import { logger } from '../core/logger'
import { ApplicationLogger } from '../interfaces/application-logger.interface'

export class ExitHandler {
  constructor(private readonly logger: ApplicationLogger) {}

  public async handleExit(code: number, timeout = 5000): Promise<void> {
    try {
      this.logger.warn(`Attempting a graceful shutdown with code ${code}`)

      setTimeout(() => {
        this.logger.warn(`Forcing a shutdown with code ${code}`)
        process.exit(code)
      }, timeout).unref()

      await server.shutdown()

      this.logger.warn(`Exiting gracefully with code ${code}`)
      process.exit(code)
    } catch (error) {
      this.logger.error('Error shutting down gracefully')
      if (error instanceof Error) {
        this.logger.error(error)
      }
      this.logger.warn(`Forcing exit with code ${code}`)
      process.exit(code)
    }
  }
}

export const exitHandler = new ExitHandler(logger)
