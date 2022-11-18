import express, { Request, Response } from 'express'
import { EnvironmentConfig } from './config'

export default class App {
  public application: express.Application
  public config = new EnvironmentConfig()

  constructor() {
    this.application = express()

    this.loadEnvironment()
    this.mountRoutes()
  }

  private loadEnvironment(): void {
    this.application.locals.env = this.config
  }

  private mountRoutes(): void {
    this.application.get('/', (req: Request, res: Response) => {
      res.send('Express + TypeScript Server')
    })
  }
}
