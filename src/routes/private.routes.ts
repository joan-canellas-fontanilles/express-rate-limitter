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

class PrivateRouter implements Router {
  private readonly route = '/private'

  constructor(
    private readonly controller: PrivateController,
    private readonly authentication: AuthenticatedGuardMiddleware
  ) {}

  public createRouter(): express.Router {
    const router = express.Router()

    router.use(this.route, this.authentication.handle.bind(this.authentication))
    router.get(this.route, this.controller.sendMessage.bind(this.controller))

    return router
  }
}

export const privateRouter = new PrivateRouter(
  privateController,
  authenticatedGuardMiddleware
)
