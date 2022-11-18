import { HttpBaseException, HttpCode } from './http-base.exception'

export class NotFoundHttpException extends HttpBaseException {
  constructor(method: string, url: string) {
    super(
      true,
      NotFoundHttpException.generateDescription(method, url),
      HttpCode.NOT_FOUND
    )
  }

  private static generateDescription(method: string, url: string): string {
    return `Path [${method}] '${url}' not found!`
  }
}
