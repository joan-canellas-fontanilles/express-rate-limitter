import { NextFunction, Request, Response } from 'express'
import { UnauthorizedHttpException } from '../exceptions/unauthorized-http.exception'
import { authService, AuthService } from '../core/auth.service'
import { ForbiddenHttpException } from '../exceptions/forbidden-http.exception'
import { Middleware } from '../interfaces/middleware.interface'

export class AuthenticatedGuardMiddleware implements Middleware {
  constructor(private readonly authService: AuthService) {}

  public async handle(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const token = this.getTokenFromHeader(req)

    if (token === undefined) {
      return next(new UnauthorizedHttpException())
    }

    try {
      const payload = await this.authService.verify(token)
      res.locals.user = payload.uuid
      next()
    } catch (e) {
      return next(new ForbiddenHttpException())
    }
  }

  private getTokenFromHeader(req: Request): string | undefined {
    const authHeader = req.headers.authorization
    return authHeader?.split(' ')[1]
  }
}

export const authenticatedGuardMiddleware = new AuthenticatedGuardMiddleware(
  authService
)
