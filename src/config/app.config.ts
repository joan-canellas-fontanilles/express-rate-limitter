import { Application } from 'express'
import { CorsConfig } from './cors.config'
import { HttpConfig } from './http.config'
import { IEnvironmentConfig } from './config.interface'

export class AppConfig {
  private readonly corsConfig = new CorsConfig()
  private readonly httpConfig = new HttpConfig()

  public init(express: Application): Application {
    const environment: IEnvironmentConfig = express.locals.env
    if (environment.isCORSEnabled) {
      express = this.corsConfig.mount(express)
    }

    express = this.httpConfig.mount(express)

    return express
  }
}
