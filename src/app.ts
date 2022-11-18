import express, { Request, Response } from 'express'

export default class App {
  public application: express.Application

  constructor() {
    this.application = express()

    this.mountRoutes()
  }

  private mountRoutes(): void {
    this.application.get('/', (req: Request, res: Response) => {
      res.send('Express + TypeScript Server')
    })
  }
}
