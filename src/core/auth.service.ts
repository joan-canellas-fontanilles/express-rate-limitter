import { EnvironmentConfig } from '../config/environment.config'

export class AuthService {
  public config = new EnvironmentConfig()

  public validate(token: string): boolean {
    return token === this.config.jwt
  }
}
