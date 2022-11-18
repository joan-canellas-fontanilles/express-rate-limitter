import { Application, Router } from 'express'

import Logger from './../core/logger'
import publicRoutes from './public.routes'
import privateRoutes from './private.routes'
import { IEnvironmentConfig } from '../config/config.interface'

class Routes {
  public mountApi(express: Application): Application {
    const environment: IEnvironmentConfig = express.locals.env
    const apiPrefix = environment.apiPrefix
    Logger.info('Routes :: Mounting API Routes...')

    const router = Router()

    router.use(publicRoutes)
    router.use(privateRoutes)

    return express.use(`/${apiPrefix}`, router)
  }
}

export default new Routes()
