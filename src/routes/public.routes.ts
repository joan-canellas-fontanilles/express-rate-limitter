import express from 'express'
import {
  publicController,
  PublicController,
} from '../controller/public.controller'
import { Router } from '../interfaces/router.interface'
import { RateLimiterMiddleware } from '../middlewares/rate-limiter.middleware'
import { memoryRequestRepository } from '../store/redis-memory-request.store'
import { EnvironmentProperties } from '../interfaces/environment-properties.interface'
import { environment } from '../config/environment'

class PublicRouter implements Router {
  private readonly route = '/public'

  constructor(
    private readonly controller: PublicController,
    private readonly environment: EnvironmentProperties
  ) {}

  public createRouter(): express.Router {
    const router = express.Router()

    const rateLimitMiddleware = new RateLimiterMiddleware(
      memoryRequestRepository,
      {
        rateLimit: this.environment.ipRateLimit,
        requestWeight: 1,
        identifierGenerator: (_, res) => res.locals.ip,
      }
    )

    router.use(this.route, rateLimitMiddleware.handle.bind(rateLimitMiddleware))

    router.get(this.route, this.controller.sendMessage.bind(this.controller))

    return router
  }
}

export const publicRouter = new PublicRouter(publicController, environment)
