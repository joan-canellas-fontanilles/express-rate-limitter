import { Application, Router } from 'express'

import Logger from './../core/logger'
import { IConfig } from '../interfaces/config.interface'
import publicRoutes from './public.routes'
import privateRoutes from './private.routes'

class Routes {
  public mountApi(express: Application): Application {
    const environment: IConfig = express.locals.env
    const apiPrefix = environment.apiPrefix
    Logger.info('Routes :: Mounting API Routes...')

    const router = Router()

    router.use(publicRoutes)
    router.use(privateRoutes)

    return express.use(`/${apiPrefix}`, router)
  }
}

export default new Routes()
