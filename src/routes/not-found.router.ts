import { Router } from '../interfaces/router.interface'
import {
  notFoundController,
  NotFoundController,
} from '../controller/not-found.controller'
import express from 'express'

export class NotFoundRouter implements Router {
  constructor(private readonly controller: NotFoundController) {}

  public createRouter(): express.Router {
    const router = express.Router()
    router.use('*', this.controller.throwError.bind(this.controller))
    return router
  }
}

export const notFoundRouter = new NotFoundRouter(notFoundController)
