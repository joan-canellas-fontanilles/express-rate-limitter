import { AppBaseException } from './app-base.exception'

export class UnhandledRejectionException extends AppBaseException {
  constructor(description: string) {
    super(UnhandledRejectionException.prototype.name, false, description)
  }
}
