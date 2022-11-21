import { environment } from '../config/environment'
import { EnvironmentProperties } from '../interfaces/environment-properties.interface'

export class AuthService {
  constructor(private readonly environment: EnvironmentProperties) {}

  public validate(token: string): boolean {
    return token === this.environment.jwt
  }
}

export const authService = new AuthService(environment)
