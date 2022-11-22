import { redisRequestRepository } from './redis-request.store'
import { RequestStore } from '../interfaces/request-store.interface'
import NodeCache from 'node-cache'

export class RedisMemoryRequestStore implements RequestStore {
  private readonly cache = new NodeCache({
    stdTTL: 60 * 60,
    checkperiod: 60,
  })

  constructor(private readonly requestStore: RequestStore) {}

  public async remaining(
    identifier: string,
    limit: number,
    timeWindow: number
  ): Promise<number> {
    if (this.cache.has(identifier)) return 0

    const remaining = await this.requestStore.remaining(
      identifier,
      limit,
      timeWindow
    )

    if (remaining === 0) {
      await this.registerFirstRequestTime(identifier, timeWindow)
    }

    return remaining
  }

  private async registerFirstRequestTime(
    identifier: string,
    timeWindow: number
  ): Promise<void> {
    const firstRequestTime = await this.requestStore.getFirstRequestTimestamp(
      identifier
    )
    const ttl = (timeWindow - Date.now() + firstRequestTime) / 1000
    this.cache.set(identifier, firstRequestTime, ttl)
  }

  public async getFirstRequestTimestamp(identifier: string): Promise<number> {
    const timestamp = this.cache.get<number>(identifier)
    return timestamp ?? 0
  }
}

export const memoryRequestRepository = new RedisMemoryRequestStore(
  redisRequestRepository
)
