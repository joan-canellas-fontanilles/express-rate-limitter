import { Application } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import compression from 'compression'
import helmet from 'helmet'
import Logger from '../core/logger'

export class HttpConfig {
  public mount(express: Application): Application {
    Logger.info("Application :: Booting Config - 'HTTP'")

    express.use(bodyParser.json({}))

    express.disable('x-powered-by')

    express.use(helmet())

    express.use(cors())

    express.use(compression())

    return express
  }
}
