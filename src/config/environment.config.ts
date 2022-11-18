import * as path from 'path'
import * as dotenv from 'dotenv'
import { bool, cleanEnv, num, str, host, CleanedEnvAccessors } from 'envalid'
import { IEnvironmentConfig } from './config.interface'

type EnvironmentValues = Readonly<
  {
    PORT: number
    REDIS_HTTP_HOST: string
    API_PREFIX: string
    LOG_DIR: string
    LOG_LEVEL: string
    IS_CORS_ENABLED: boolean
    REDIS_HTTP_PORT: number
    URL: string
    JWT: string
  } & CleanedEnvAccessors
>

export class EnvironmentConfig implements IEnvironmentConfig {
  public readonly url: string
  public readonly port: number
  public readonly apiPrefix: string
  public readonly logDir: string
  public readonly isCORSEnabled: boolean
  public readonly redisHttpPort: number
  public readonly redisHttpHost: string
  public readonly logLevel: string
  public readonly jwt: string

  constructor() {
    dotenv.config({ path: path.join(__dirname, '../../.env') })
    const config = this.getEnvironmentConfig()

    this.url = config.URL.replace('{port}', String(config.PORT))
    this.port = config.PORT
    this.apiPrefix = config.API_PREFIX
    this.logDir = path.join(__dirname, '..', config.LOG_DIR, 'log.log')
    this.isCORSEnabled = config.IS_CORS_ENABLED
    this.redisHttpPort = config.REDIS_HTTP_PORT
    this.redisHttpHost = config.REDIS_HTTP_HOST
    this.logLevel = config.LOG_LEVEL
    this.jwt = config.JWT
  }

  private getEnvironmentConfig(): EnvironmentValues {
    return cleanEnv(process.env, {
      PORT: num({ default: 4040 }),
      URL: host({ default: 'http://localhost:{port}' }),
      API_PREFIX: str({ default: 'api' }),
      IS_CORS_ENABLED: bool({ default: true }),
      REDIS_HTTP_PORT: num({ default: 6379 }),
      REDIS_HTTP_HOST: host({ default: '127.0.0.1' }),
      LOG_DIR: str({ default: 'logs' }),
      LOG_LEVEL: str({ default: 'info' }),
      JWT: str({}),
    })
  }
}
