import { Middleware } from '../interfaces/middleware.interface'
import { Request, Response, NextFunction } from 'express'
import { TooManyRequestHttpException } from '../exceptions/too-many-request-http.exception'
import { RequestStore } from '../interfaces/request-store.interface'
import { RateLimiterProperties } from '../interfaces/rate-limiter-properties.interface'

export class RateLimiterMiddleware implements Middleware {
  private readonly configuration: Required<RateLimiterProperties>

  constructor(
    private readonly requestRepository: RequestStore,
    configuration: RateLimiterProperties
  ) {
    this.configuration = {
      timeWindow: 1000 * 60 * 60,
      ...configuration,
    }
  }

  public async handle(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const identifier = this.configuration.identifierGenerator(req, res)

    try {
      const remainingCalls = await this.requestRepository.remaining(
        identifier,
        this.configuration.rateLimit,
        this.configuration.timeWindow
      )

      res.header('RateLimit-Limit', String(this.configuration.rateLimit))
      res.header('RateLimit-Remaining', String(remainingCalls))

      if (remainingCalls <= 0) {
        const firstRequestTimestamp =
          await this.requestRepository.getFirstRequestTimestamp(identifier)
        const rateLimitReset =
          firstRequestTimestamp + this.configuration.timeWindow

        res.header('RateLimit-Reset', String(rateLimitReset))
        return next(
          new TooManyRequestHttpException(
            this.configuration.rateLimit,
            rateLimitReset
          )
        )
      }
      return next()
    } catch (error) {
      return next(error)
    }
  }
}
