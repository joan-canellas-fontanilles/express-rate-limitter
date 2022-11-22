import * as path from 'path'
import * as dotenv from 'dotenv'
import { bool, cleanEnv, num, str, host, CleanedEnvAccessors } from 'envalid'
import { EnvironmentProperties } from '../interfaces/environment-properties.interface'

type EnvironmentValues = Readonly<
  {
    URL: string
    PORT: number
    API_PREFIX: string
    LOG_DIR: string
    LOG_LEVEL: string
    IS_CORS_ENABLED: boolean
    REDIS_HTTP_HOST: string
    REDIS_HTTP_PORT: number
    JWT: string
    JWT_SECRET: string
    IP_RATE_LIMIT: number
    TOKEN_RATE_LIMIT: number
  } & CleanedEnvAccessors
>

export class Environment implements EnvironmentProperties {
  public readonly url: string
  public readonly port: number
  public readonly apiPrefix: string
  public readonly logDir: string
  public readonly isCORSEnabled: boolean
  public readonly redisHttpPort: number
  public readonly redisHttpHost: string
  public readonly logLevel: string
  public readonly jwtSecret: string
  public readonly jwt: string
  public readonly ipRateLimit: number
  public readonly tokenRateLimit: number

  constructor() {
    dotenv.config({ path: path.join(__dirname, '../../.env') })
    const config = this.getEnvironmentConfig()

    this.url = config.URL.replace('{port}', String(config.PORT))
    this.port = config.PORT
    this.apiPrefix = config.API_PREFIX
    this.logDir = path.join(__dirname, '../..', config.LOG_DIR, 'log.log')
    this.isCORSEnabled = config.IS_CORS_ENABLED
    this.redisHttpPort = config.REDIS_HTTP_PORT
    this.redisHttpHost = config.REDIS_HTTP_HOST
    this.logLevel = config.LOG_LEVEL
    this.jwtSecret = config.JWT_SECRET
    this.jwt = config.JWT
    this.ipRateLimit = config.IP_RATE_LIMIT
    this.tokenRateLimit = config.TOKEN_RATE_LIMIT
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
      JWT_SECRET: str(),
      JWT: str(),
      IP_RATE_LIMIT: num({ default: 100 }),
      TOKEN_RATE_LIMIT: num({ default: 200 }),
    })
  }
}

export const environment = new Environment()
