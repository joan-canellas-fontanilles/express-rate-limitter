import App from './app'
import { Server } from 'http'
import Logger from './core/logger'

class ExpressServer {
  public app: App
  public server?: Server

  constructor() {
    Logger.info('Server :: Booting')
    this.app = new App()
  }

  public init(): void {
    const port = this.app.config.port
    const url = this.app.config.url

    this.server = this.app.application
      .listen(port, () => Logger.info(`Server :: Running @ '${url}'`))
      .on('error', (error) => Logger.error('Error: ', error.message))
  }

  public async shutdown(): Promise<void> {
    return await new Promise((resolve, reject) => {
      if (this.server !== undefined) {
        this.server.on('close', () => resolve())
        this.server.close((error) => reject(error))
      }
      return resolve()
    })
  }
}

export default new ExpressServer()
