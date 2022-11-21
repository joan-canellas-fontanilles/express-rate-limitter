import { Middleware } from '../interfaces/middleware.interface'
import { Request, Response, NextFunction } from 'express'
import { TooManyRequestHttpException } from '../exceptions/too-many-request-http.exception'
import { RequestStore } from '../interfaces/request-store.interface'

export class RateLimiterMiddleware implements Middleware {
  private readonly maxRequestCount = 10

  constructor(private readonly requestRepository: RequestStore) {}

  public async handle(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const identifier = res.locals.ip
    const timeWindow = 1000 * 60 * 60

    try {
      const remainingCalls = await this.requestRepository.remaining(
        identifier,
        this.maxRequestCount,
        timeWindow
      )

      res.header('RateLimit-Limit', String(this.maxRequestCount))
      res.header('RateLimit-Remaining', String(remainingCalls))

      if (remainingCalls <= 0) {
        const firstRequestTimestamp =
          await this.requestRepository.getFirstRequestTimestamp(identifier)
        const rateLimitReset = firstRequestTimestamp + timeWindow

        res.header('RateLimit-Reset', String(rateLimitReset))
        return next(
          new TooManyRequestHttpException(this.maxRequestCount, rateLimitReset)
        )
      }
      return next()
    } catch (error) {
      return next(error)
    }
  }
}
