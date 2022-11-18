import express, { Application } from 'express'
import { EnvironmentConfig } from './config'
import Logger from './core/logger'
import Routes from './routes/routes'

export default class App {
  public application: Application
  public config = new EnvironmentConfig()

  constructor() {
    this.application = express()

    this.loadEnvironment()
    this.mountRoutes()
  }

  private loadEnvironment(): void {
    Logger.info('Application :: Loading environment variables...')
    this.application.locals.env = this.config
  }

  private mountRoutes(): void {
    this.application = Routes.mountApi(this.application)
  }
}
