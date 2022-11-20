import { Application, NextFunction, Request, Response, Router } from 'express'

import Logger from './../core/logger'
import publicRoutes from './public.routes'
import privateRoutes from './private.routes'
import { NotFoundHttpException } from '../exceptions/not-found-http.exception'
import { environment } from '../config/environment'

class Routes {
  public mount(express: Application): Application {
    const apiPrefix = environment.apiPrefix
    Logger.info('Routes :: Mounting API Routes...')

    const router = Router()

    router.use(publicRoutes)
    router.use(privateRoutes)

    express.use(`/${apiPrefix}`, router)

    express.use('*', (req: Request, res: Response, next: NextFunction) => {
      next(new NotFoundHttpException(req.method, req.originalUrl))
    })

    return express
  }
}

export default new Routes()
