import { Application, Request, Response, NextFunction } from 'express'

export class RequestIpMiddleware {
  public mount(express: Application): Application {
    express.use('*', (req: Request, res: Response, next: NextFunction) => {
      res.locals.ip = this.getIp(req)
      next()
    })

    return express
  }

  public getIp(req: Request): string {
    return this.getForwardedIp(req) ?? req.socket.remoteAddress ?? 'unknown'
  }

  public getForwardedIp(req: Request): string | undefined {
    const forwarded = req.headers['x-forwarded-for']
    if (Array.isArray(forwarded)) return forwarded[0]
    return forwarded
  }
}
