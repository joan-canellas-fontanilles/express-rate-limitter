import { HttpBaseException, HttpCode } from './http-base.exception'

export class TooManyRequestHttpException extends HttpBaseException {
  constructor(
    public readonly maxRequestCount: number,
    public readonly rateLimitReset: number
  ) {
    super(
      true,
      TooManyRequestHttpException.generateDescription(
        maxRequestCount,
        rateLimitReset
      ),
      HttpCode.TOO_MANY_REQUEST
    )
  }

  private static generateDescription(
    maxRequestCount: number,
    rateLimitReset: number
  ): string {
    const reset = new Date(rateLimitReset).toUTCString()
    return `You have exceeded the number of request available (${maxRequestCount} req/h). Wait until ${reset} for the next request`
  }
}
