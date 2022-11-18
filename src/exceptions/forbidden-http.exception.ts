import { HttpBaseException, HttpCode } from './http-base.exception'

export class ForbiddenHttpException extends HttpBaseException {
  constructor() {
    super(
      true,
      ForbiddenHttpException.generateDescription(),
      HttpCode.FORBIDDEN
    )
  }

  private static generateDescription(): string {
    return 'The client does not have access rights for this content'
  }
}
