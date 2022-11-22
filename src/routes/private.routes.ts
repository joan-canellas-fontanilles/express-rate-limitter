import {
  privateController,
  PrivateController,
} from '../controller/private.controller'
import {
  AuthenticatedGuardMiddleware,
  authenticatedGuardMiddleware,
} from '../middlewares/authenticated-guard.middleware'
import { Router } from '../interfaces/router.interface'
import express from 'express'
import { RateLimiterMiddleware } from '../middlewares/rate-limiter.middleware'
import { memoryRequestRepository } from '../store/redis-memory-request.store'
import { EnvironmentProperties } from '../interfaces/environment-properties.interface'
import { environment } from '../config/environment'

class PrivateRouter implements Router {
  private readonly route = '/private'

  constructor(
    private readonly controller: PrivateController,
    private readonly authentication: AuthenticatedGuardMiddleware,
    private readonly environment: EnvironmentProperties
  ) {}

  public createRouter(): express.Router {
    const router = express.Router()

    router.use(this.route, this.authentication.handle.bind(this.authentication))

    const rateLimitMiddleware = new RateLimiterMiddleware(
      memoryRequestRepository,
      {
        rateLimit: this.environment.tokenRateLimit,
        requestWeight: 1,
        identifierGenerator: (_, res) => res.locals.user,
      }
    )

    router.get(this.route, rateLimitMiddleware.handle.bind(rateLimitMiddleware))
    router.get(this.route, this.controller.sendMessage.bind(this.controller))

    return router
  }
}

export const privateRouter = new PrivateRouter(
  privateController,
  authenticatedGuardMiddleware,
  environment
)
