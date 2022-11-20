import { Server } from 'http'
import { CustomLogger, logger } from './core/logger'
import { Application } from 'express'
import { environment } from './config/environment'

class ExpressServer {
  private server?: Server

  constructor(private readonly logger: CustomLogger) {}

  public init(application: Application): void {
    const port = environment.port
    const url = environment.url

    this.server = application
      .listen(port, () => this.logger.info(`Server :: Running @ '${url}'`))
      .on('error', (error) => this.logger.error('Error: ', error.message))
  }

  public async shutdown(): Promise<void> {
    return await new Promise((resolve, reject) => {
      if (this.server !== undefined) {
        this.server.on('close', () => resolve())
        this.server.close((error) => reject(error))
      }
      return resolve()
    })
  }
}

export const server = new ExpressServer(logger)
