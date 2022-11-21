import { Request, Response } from 'express'

export interface RateLimiterProperties {
  rateLimit: number
  requestWeight: number
  identifierGenerator: (request: Request, response: Response) => string
  timeWindow?: number
}
