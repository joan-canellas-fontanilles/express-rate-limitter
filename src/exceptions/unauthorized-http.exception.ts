import { HttpBaseException, HttpCode } from './http-base.exception'

export class UnauthorizedHttpException extends HttpBaseException {
  constructor() {
    super(
      true,
      UnauthorizedHttpException.generateDescription(),
      HttpCode.UNAUTHORIZED
    )
  }

  private static generateDescription(): string {
    return `This route requires authentication`
  }
}
