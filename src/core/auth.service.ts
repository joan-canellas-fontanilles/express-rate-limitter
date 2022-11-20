import { Environment } from '../config/environment'

export class AuthService {
  public config = new Environment()

  public validate(token: string): boolean {
    return token === this.config.jwt
  }
}
