import express from 'express'
import Logger from './core/logger'
import Routes from './routes/routes'
import { AppConfig } from './config/app.config'
import { ErrorHandler } from './core/error.handler'
import { RequestIpMiddleware } from './middlewares/request-ip.middleware'

export class Application {
  public instance: express.Application

  constructor() {
    Logger.info('Application :: Booting')
    this.instance = express()

    this.loadConfiguration()
    this.mountMiddlewares()
    this.mountRoutes()
    this.loadErrorHandlers()
  }

  private loadConfiguration(): void {
    const config = new AppConfig()
    this.instance = config.init(this.instance)
  }

  private mountMiddlewares(): void {
    const requestIpMiddleware = new RequestIpMiddleware()
    this.instance = requestIpMiddleware.mount(this.instance)
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
