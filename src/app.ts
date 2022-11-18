import express, { Request, Response } from 'express'
import { EnvironmentConfig } from './config'
import Logger from './core/logger'

export default class App {
  public application: express.Application
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
    this.application.get('/', (req: Request, res: Response) => {
      res.send('Express + TypeScript Server')
    })
  }
}
