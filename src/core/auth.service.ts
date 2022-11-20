import { environment } from '../config/environment'

export class AuthService {
  public validate(token: string): boolean {
    return token === environment.jwt
  }
}
