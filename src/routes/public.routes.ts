import { Router } from 'express'
import { PublicController } from '../controller/public.controller'

const router = Router()
const controller = new PublicController()

router.get('/public', controller.sendMessage)

export default router
