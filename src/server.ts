import App from './app'
import { Server } from 'http'

class ExpressServer {
  public app = new App()
  public server?: Server

  public init(): void {
    const port = this.app.config.port
    const url = this.app.config.url

    this.server = this.app.application
      .listen(port, () => console.log(`Server :: Running @ '${url}'`))
      .on('error', (error) => console.log('Error: ', error.message))
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
