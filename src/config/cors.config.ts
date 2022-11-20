import cors from 'cors'
import Logger from '../core/logger'
import { Application } from 'express'
import { environment } from './environment'

export class CorsConfig {
  public mount(express: Application): Application {
    Logger.info("Application :: Booting Config - 'Cors'")

    const options = {
      origin: environment.url,
      optionsSuccessStatus: 200,
    }

    express.use(cors(options))

    return express
  }
}
