import { Router } from 'express'
import { PrivateController } from '../controller/private.controller'
import { AuthenticatedGuardMiddleware } from '../middlewares/authenticated-guard.middleware'
import { AuthService } from '../core/auth.service'

const router = Router()
const controller = new PrivateController()

const authentication = new AuthenticatedGuardMiddleware(new AuthService())

router.use('/private', authentication.guard.bind(authentication))

router.get('/private', controller.sendMessage)

export default router
