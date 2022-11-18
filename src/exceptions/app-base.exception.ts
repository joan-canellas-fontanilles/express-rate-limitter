export abstract class AppBaseException extends Error {
  public readonly name: string

  protected constructor(
    name: string | undefined,
    public readonly isOperational: boolean,
    public readonly description: string
  ) {
    super(description)

    this.name = name ?? this.constructor.name

    Object.setPrototypeOf(this, new.target.prototype)
    Error.captureStackTrace(this)
  }
}
