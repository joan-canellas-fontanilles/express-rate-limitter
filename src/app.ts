import express, { Application } from 'express'
import Logger from './core/logger'
import Routes from './routes/routes'
import { AppConfig } from './config/app.config'
import { EnvironmentConfig } from './config/environment.config'

export default class App {
  public application: Application
  public config = new EnvironmentConfig()

  constructor() {
    this.application = express()

    this.loadEnvironment()
    this.loadConfiguration()
    this.mountRoutes()
  }

  private loadEnvironment(): void {
    Logger.info('Application :: Loading environment variables...')
    this.application.locals.env = this.config
  }

  private loadConfiguration(): void {
    const config = new AppConfig()
    this.application = config.init(this.application)
  }

  private mountRoutes(): void {
    this.application = Routes.mountApi(this.application)
  }
}
