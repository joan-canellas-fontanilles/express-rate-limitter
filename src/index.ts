import Server from './server'
import { nativeEventHandler } from './core/native-events.handler'

nativeEventHandler.handle()
Server.init()
