import express, { Application } from 'express'
import Logger from './core/logger'
import Routes from './routes/routes'
import { AppConfig } from './config/app.config'
import { EnvironmentConfig } from './config/environment.config'
import { ErrorHandler } from './core/error.handler'

export default class App {
  public application: Application
  public config = new EnvironmentConfig()

  constructor() {
    this.application = express()

    this.loadEnvironment()
    this.loadConfiguration()
    this.mountRoutes()
    this.loadErrorHandlers()
  }

  private loadEnvironment(): void {
    Logger.info('Application :: Loading - Environment variables...')
    this.application.locals.env = this.config
  }

  private loadConfiguration(): void {
    const config = new AppConfig()
    this.application = config.init(this.application)
  }

  private mountRoutes(): void {
    this.application = Routes.mountApi(this.application)
  }

  private loadErrorHandlers(): void {
    const errorHandler = new ErrorHandler()
    this.application = errorHandler.handle(this.application)
  }
}
