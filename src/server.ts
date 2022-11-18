import dotenv from 'dotenv'
import App from './app'

class Server {
  public app = new App()

  public init(): void {
    dotenv.config()
    const port = process.env.PORT ?? '8000'

    this.app.application.listen(port, () => {
      console.log(`[server]: Server is running at http://localhost:${port}`)
    })
  }

  public shutdown(): void {}
}

export default new Server()
