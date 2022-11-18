import { Router } from 'express'
import { PrivateController } from '../controller/private.controller'

const router = Router()
const controller = new PrivateController()

router.get('/private', controller.sendMessage)

export default router
