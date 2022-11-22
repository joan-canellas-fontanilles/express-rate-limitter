jest.mock('../src/core/logger', () => ({
  logger: {
    warn: jest.fn(),
    info: jest.fn(),
    error: jest.fn(),
  },
}))

const redisRequestStore = {
  init: jest.fn().mockImplementation(() => Promise.resolve()),
  remaining: jest.fn(),
  getFirstRequestTimestamp: jest.fn(),
}

jest.mock('../src/store/redis-request.store.ts', () => ({
  redisRequestStore,
}))

import request from 'supertest'
import { environment } from '../src/config/environment'
import { Application } from '../src/application'
import { logger } from '../src/core/logger'

describe('Testing private route', () => {
  const app = new Application(logger, environment)
  const route = '/api/private'

  it('Should return a 200 message', async () => {
    const response = await request(app.instance)
      .get(route)
      .set('Authorization', `Bearer ${environment.jwt}`)

    expect(response.status).toEqual(200)
    expect(response.body.message).toEqual(
      'Message response for the private route'
    )
  })

  it('Should return a 401 message if no token is sent', async () => {
    const response = await request(app.instance).get(route)
    expect(response.status).toEqual(401)
    expect(response.body.description).toEqual(
      'This route requires authentication'
    )
  })

  it('Should return a 403 message if the token is invalid', async () => {
    const response = await request(app.instance)
      .get(route)
      .set('Authorization', `Bearer not-valid`)
    expect(response.status).toEqual(403)
    expect(response.body.description).toEqual(
      'The client does not have access rights for this content'
    )
  })

  it('Should return a 429 message if request limit reached', async () => {
    jest.spyOn(redisRequestStore, 'remaining').mockResolvedValue(0)
    const response = await request(app.instance)
      .get(route)
      .set('Authorization', `Bearer ${environment.jwt}`)
    expect(response.status).toEqual(429)
    expect(response.body.description).toMatch(
      'You have exceeded the number of request available'
    )
  })
})
