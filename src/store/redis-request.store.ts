import { createClient, RedisClientType } from 'redis'
import { EnvironmentProperties } from '../interfaces/environment-properties.interface'
import { environment } from '../config/environment'
import { randomUUID } from 'crypto'
import { RequestStore } from '../interfaces/request-store.interface'

export class RedisRequestStore implements RequestStore {
  public client: RedisClientType
  constructor(private readonly environment: EnvironmentProperties) {
    this.client = createClient({
      socket: {
        host: this.environment.redisHttpHost,
        port: this.environment.redisHttpPort,
      },
    })

    this.client.on('error', (error) => {
      throw new Error(error)
    })
  }

  public async init(): Promise<void> {
    await this.client.connect()
  }

  public async remaining(
    identifier: string,
    limit: number,
    timeWindow: number
  ): Promise<number> {
    const now = Date.now()
    const slidingWindow = now - timeWindow
    const uuid = randomUUID()

    const script = `
      local identifier = KEYS[1]
      local uuid = KEYS[2]
      local limit = tonumber(ARGV[1])
      local now = tonumber(ARGV[2])
      local amount = redis.call('ZCARD', identifier)
      if amount < limit then 
        redis.call('ZADD', identifier, now, uuid) 
      end
      return limit - amount
    `

    const scriptArguments = [limit, now].map(String)

    const value = await this.client
      .multi()
      .zRemRangeByScore(identifier, 0, now - timeWindow)
      .eval(script, { keys: [identifier, uuid], arguments: scriptArguments })
      .expire(identifier, slidingWindow)
      .exec()

    return value[1] as number
  }

  public async getFirstRequestTimestamp(identifier: string): Promise<number> {
    const uuid = await this.client.zRange(identifier, 0, 1)
    const timestamp = await this.client.zScore(identifier, uuid[0])
    return Number(timestamp)
  }
}

export const redisRequestRepository = new RedisRequestStore(environment)
