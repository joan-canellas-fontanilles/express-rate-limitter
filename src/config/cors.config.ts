import cors from 'cors'
import Logger from '../core/logger'
import { Application } from 'express'
import { IEnvironmentConfig } from './config.interface'

export class CorsConfig {
  public mount(express: Application): Application {
    Logger.info("Application :: Booting Config - 'Cors'")

    const environment: IEnvironmentConfig = express.locals.env

    const options = {
      origin: environment.url,
      optionsSuccessStatus: 200,
    }

    express.use(cors(options))

    return express
  }
}
