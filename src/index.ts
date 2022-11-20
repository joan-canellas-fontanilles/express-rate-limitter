import Server from './server'
import { nativeEventHandler } from './core/native-events.handler'
import { application } from './application'

nativeEventHandler.handle()
Server.init(application.instance)
