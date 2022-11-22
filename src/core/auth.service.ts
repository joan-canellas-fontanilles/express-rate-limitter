import { environment } from '../config/environment'
import { EnvironmentProperties } from '../interfaces/environment-properties.interface'
import jwt from 'jsonwebtoken'
import { JwtUserPayload } from '../interfaces/jwt-user-payload.interface'

export class AuthService {
  constructor(private readonly environment: EnvironmentProperties) {}

  public async verify(token: string): Promise<JwtUserPayload> {
    return await new Promise((resolve, reject) => {
      jwt.verify(token, this.environment.jwtSecret, (error, payload) => {
        if (error != null) return reject(error)
        if (!this.isJwtUserPayload(payload)) {
          return reject(new Error('The jwt payload is not valid'))
        }
        return resolve(payload)
      })
    })
  }

  private isJwtUserPayload(payload: unknown): payload is JwtUserPayload {
    return payload instanceof Object && 'uuid' in payload
  }
}

export const authService = new AuthService(environment)
