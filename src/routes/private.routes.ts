import { Router } from 'express'
import { PrivateController } from '../controller/private.controller'
import { authenticatedGuardMiddleware } from '../middlewares/authenticated-guard.middleware'

const router = Router()
const controller = new PrivateController()
const authentication = authenticatedGuardMiddleware.handle.bind(
  authenticatedGuardMiddleware
)

router.use('/private', authentication)
router.get('/private', controller.sendMessage)

export default router
