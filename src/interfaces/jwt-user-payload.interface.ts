import { JwtPayload } from 'jsonwebtoken'

export interface JwtUserPayload extends JwtPayload {
  uuid: string
}
