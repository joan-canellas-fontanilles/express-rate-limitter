import express from 'express'
import Logger from './core/logger'
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

export class Application {
  public instance: express.Application

  constructor() {
    Logger.info('Application :: Booting')
    this.instance = express()

    this.loadHttpConfiguration()
    this.mountMiddlewares()
    this.mountRoutes()
    this.loadErrorHandlers()
  }

  private loadHttpConfiguration(): void {
    Logger.info("Application :: Booting Config - 'HTTP'")

    this.instance.use(bodyParser.json({}))
    this.instance.use(helmet())
    this.instance.use(compression())
    this.instance.use(cors(this.getCorsConfig()))
  }

  private getCorsConfig(): CorsOptions {
    if (environment.isCORSEnabled) {
      return {
        origin: environment.url,
        optionsSuccessStatus: 200,
      }
    }
    return {}
  }

  private mountMiddlewares(): void {
    this.instance.use(requestIpMiddleware.handle.bind(requestIpMiddleware))
  }

  private mountRoutes(): void {
    Logger.info('Routes :: Mounting API Routes...')

    this.instance.use(`/${environment.apiPrefix}`, publicRouter.createRouter())
    this.instance.use(`/${environment.apiPrefix}`, privateRouter.createRouter())

    this.instance.use(notFoundRouter.createRouter())
  }

  private loadErrorHandlers(): void {
    Logger.info('Application :: Booting - Error handlers')
    this.instance.use(errorHandler.handle.bind(errorHandler))
  }
}

export const application = new Application()
