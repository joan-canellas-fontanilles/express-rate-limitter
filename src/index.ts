import { application } from './application'
import { nativeEventHandler } from './handlers/native-events.handler'
import { server } from './server'

nativeEventHandler.handle()

server.init(application.instance)
