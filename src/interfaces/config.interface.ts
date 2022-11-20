export interface EnvironmentProperties {
  readonly url: string
  readonly port: number
  readonly apiPrefix: string
  readonly logDir: string
  readonly isCORSEnabled: boolean
  readonly redisHttpPort: number
  readonly redisHttpHost: string
  readonly logLevel: string
}
