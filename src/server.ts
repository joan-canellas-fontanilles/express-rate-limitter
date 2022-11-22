import { Server } from 'http'
import { logger } from './core/logger'
import { Application } from 'express'
import { environment } from './config/environment'
import { ApplicationLogger } from './interfaces/application-logger.interface'

export class ExpressServer {
  private server?: Server

  constructor(private readonly logger: ApplicationLogger) {}

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
