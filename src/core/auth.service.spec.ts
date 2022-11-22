import { AuthService } from './auth.service'
import { EnvironmentProperties } from '../interfaces/environment-properties.interface'
import { JsonWebTokenError } from 'jsonwebtoken'

describe('Auth service', () => {
  let service: AuthService

  beforeEach(() => {
    const environment: Partial<EnvironmentProperties> = {
      jwtSecret: 'your-256-bit-secret',
    }
    service = new AuthService(environment as EnvironmentProperties)
  })

  it('Should return the payload when verifying a valid jwt', async () => {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiWFhYWFhYWFgtWFhYWC1YWFhYLVhYWFgtWFhYWFhYWFhYWFhYIiwiaWF0IjoxNTE2MjM5MDIyfQ.nwbUo1dshp6k09VaTyMkq5BquDyJvQQDhkMRQLZ2cl8'

    const payload = await service.verify(token)

    expect(payload.uuid).toBe('XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX')
  })

  it('Should throw an error if the jwt is not valid', async () => {
    const token = 'not-valid'
    await expect(service.verify(token)).rejects.toThrow(JsonWebTokenError)
  })

  it('Should throw an error if the jwt payload is not valid', async () => {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.Et9HFtf9R3GEMA0IICOfFMVXY7kkTX1wr4qCyhIf58U'
    await expect(service.verify(token)).rejects.toThrow(Error)
  })
})
