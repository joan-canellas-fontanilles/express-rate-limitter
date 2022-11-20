import { NotFoundHttpException } from '../exceptions/not-found-http.exception'
import { Request, Response, NextFunction } from 'express'

export class NotFoundController {
  public throwError(req: Request, res: Response, next: NextFunction): void {
    next(new NotFoundHttpException(req.method, req.originalUrl))
  }
}

export const notFoundController = new NotFoundController()
