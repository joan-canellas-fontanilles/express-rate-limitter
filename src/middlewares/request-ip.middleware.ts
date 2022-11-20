import { Request, Response, NextFunction } from 'express'
import { Middleware } from '../interfaces/middleware.interface'

export class RequestIpMiddleware implements Middleware {
  public handle(req: Request, res: Response, next: NextFunction): void {
    res.locals.ip = this.getIp(req)
    next()
  }

  private getIp(req: Request): string {
    return this.getForwardedIp(req) ?? req.socket.remoteAddress ?? 'unknown'
  }

  private getForwardedIp(req: Request): string | undefined {
    const forwarded = req.headers['x-forwarded-for']
    if (Array.isArray(forwarded)) return forwarded[0]
    return forwarded
  }
}

export const requestIpMiddleware = new RequestIpMiddleware()
