import express from 'express'
import Logger from './core/logger'
import Routes from './routes/routes'
import { ErrorHandler } from './core/error.handler'
import { requestIpMiddleware } from './middlewares/request-ip.middleware'
import bodyParser from 'body-parser'
import helmet from 'helmet'
import cors, { CorsOptions } from 'cors'
import compression from 'compression'
import { environment } from './config/environment'

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
    this.instance = Routes.mount(this.instance)
  }

  private loadErrorHandlers(): void {
    const errorHandler = new ErrorHandler()
    this.instance = errorHandler.handle(this.instance)
  }
}

export const application = new Application()
