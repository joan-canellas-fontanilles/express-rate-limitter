import { application } from './application'
import { nativeEventHandler } from './handlers/native-events.handler'
import { server } from './server'

nativeEventHandler.handle()
void application.initDB().then(() => {
  server.init(application.instance)
})
