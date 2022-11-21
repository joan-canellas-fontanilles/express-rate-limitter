import express from 'express'
import {
  publicController,
  PublicController,
} from '../controller/public.controller'
import { Router } from '../interfaces/router.interface'
import { RateLimiterMiddleware } from '../middlewares/rate-limiter.middleware'
import { redisRequestRepository } from '../store/redis-request.store'

class PublicRouter implements Router {
  private readonly route = '/public'

  constructor(private readonly controller: PublicController) {}

  public createRouter(): express.Router {
    const router = express.Router()

    const rateLimitMiddleware = new RateLimiterMiddleware(
      redisRequestRepository
    )

    router.use(rateLimitMiddleware.handle.bind(rateLimitMiddleware))

    router.get(this.route, this.controller.sendMessage.bind(this.controller))

    return router
  }
}

export const publicRouter = new PublicRouter(publicController)
