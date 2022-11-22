import express from 'express'
import { logger } from './core/logger'
import { requestIpMiddleware } from './middlewares/request-ip.middleware'
import bodyParser from 'body-parser'
import helmet from 'helmet'
import cors, { CorsOptions } from 'cors'
import compression from 'compression'
import { environment } from './config/environment'
import { publicRouter } from './routes/public.routes'
import { privateRouter } from './routes/private.routes'
import { notFoundRouter } from './routes/not-found.router'
import { errorHandler } from './handlers/error.handler'
import { EnvironmentProperties } from './interfaces/environment-properties.interface'
import { redisRequestRepository } from './store/redis-request.store'
import { ApplicationLogger } from './interfaces/application-logger.interface'

export class Application {
  public instance: express.Application

  constructor(
    private readonly logger: ApplicationLogger,
    private readonly environment: EnvironmentProperties
  ) {
    this.logger.info('Application :: Booting')
    this.instance = express()

    this.loadHttpConfiguration()
    this.mountMiddlewares()
    this.mountRoutes()
    this.loadErrorHandlers()
  }

  private loadHttpConfiguration(): void {
    this.logger.info("Application :: Booting Config - 'HTTP'")

    this.instance.use(bodyParser.json({}))
    this.instance.use(helmet())
    this.instance.use(compression())
    this.instance.use(cors(this.getCorsConfig()))
  }

  private getCorsConfig(): CorsOptions {
    if (this.environment.isCORSEnabled) {
      return {
        origin: this.environment.url,
        optionsSuccessStatus: 200,
      }
    }
    return {}
  }

  private mountMiddlewares(): void {
    this.instance.use(requestIpMiddleware.handle.bind(requestIpMiddleware))
  }

  private mountRoutes(): void {
    this.logger.info('Routes :: Mounting API Routes...')

    this.instance.use(
      `/${this.environment.apiPrefix}`,
      publicRouter.createRouter()
    )
    this.instance.use(
      `/${this.environment.apiPrefix}`,
      privateRouter.createRouter()
    )

    this.instance.use(notFoundRouter.createRouter())
  }

  private loadErrorHandlers(): void {
    this.logger.info('Application :: Booting - Error handlers')
    this.instance.use(errorHandler.handle.bind(errorHandler))
  }

  public async initDB(): Promise<void> {
    this.logger.info('Application :: Init - Redis DB')
    await redisRequestRepository.init()
  }
}

export const application = new Application(logger, environment)
