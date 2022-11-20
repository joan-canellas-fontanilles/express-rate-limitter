import { Application } from 'express'
import { CorsConfig } from './cors.config'
import { HttpConfig } from './http.config'
import { environment } from './environment'

export class AppConfig {
  private readonly corsConfig = new CorsConfig()
  private readonly httpConfig = new HttpConfig()

  public init(express: Application): Application {
    if (environment.isCORSEnabled) {
      express = this.corsConfig.mount(express)
    }

    express = this.httpConfig.mount(express)

    return express
  }
}
