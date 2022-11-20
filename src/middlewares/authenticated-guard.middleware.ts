import { NextFunction, Request, Response } from 'express'
import { UnauthorizedHttpException } from '../exceptions/unauthorized-http.exception'
import { AuthService } from '../core/auth.service'
import { ForbiddenHttpException } from '../exceptions/forbidden-http.exception'
import { Middleware } from '../interfaces/middleware.interface'

export class AuthenticatedGuardMiddleware implements Middleware {
  constructor(public authService: AuthService) {}

  public handle(req: Request, res: Response, next: NextFunction): void {
    const token = this.getTokenFromHeader(req)

    if (token === undefined) {
      return next(new UnauthorizedHttpException())
    }
    if (!this.authService.validate(token)) {
      return next(new ForbiddenHttpException())
    }

    res.locals.user = token

    next()
  }

  private getTokenFromHeader(req: Request): string | undefined {
    const authHeader = req.headers.authorization
    return authHeader?.split(' ')[1]
  }
}

export const authenticatedGuardMiddleware = new AuthenticatedGuardMiddleware(
  new AuthService()
)
