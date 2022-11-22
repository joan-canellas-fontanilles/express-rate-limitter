import { RedisMemoryRequestStore } from './redis-memory-request.store'
import { RequestStore } from '../interfaces/request-store.interface'

describe('redis memory request store', () => {
  let store: RedisMemoryRequestStore
  let redisStore: RequestStore
  let firstRequestTimestamp: number

  beforeEach(() => {
    redisStore = {
      remaining: jest.fn(),
      getFirstRequestTimestamp: jest.fn(),
    }

    store = new RedisMemoryRequestStore(redisStore)

    firstRequestTimestamp = Date.now() - 100000
    jest
      .spyOn(redisStore, 'getFirstRequestTimestamp')
      .mockResolvedValue(firstRequestTimestamp)
  })

  it('should remaining return the request left for the identity', async () => {
    jest.spyOn(redisStore, 'remaining').mockResolvedValue(0)

    const remainingRequests = await store.remaining('id', 10, 3600000)

    expect(remainingRequests).toBe(0)
  })

  it('should remaining return 0 if it has a value cached for that identity', async () => {
    const remaining = jest.spyOn(redisStore, 'remaining').mockResolvedValue(0)

    await store.remaining('id', 10, 3600000)

    remaining.mockReset()

    const remainingRequests = await store.remaining('id', 10, 3600000)

    expect(remaining).not.toBeCalled()
    expect(remainingRequests).toBe(0)
  })

  it('should getFirstRequestTimestamp return the first request stored in cache', async () => {
    jest.spyOn(redisStore, 'remaining').mockResolvedValue(0)

    await store.remaining('id', 10, 3600000)

    const firstRequest = await store.getFirstRequestTimestamp('id')
    expect(firstRequest).toBe(firstRequestTimestamp)
  })

  it('should getFirstRequestTimestamp return 0 if no first request is stored in cache', async () => {
    const firstRequest = await store.getFirstRequestTimestamp('id')
    expect(firstRequest).toBe(0)
  })
})
