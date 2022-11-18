import { Request, Response } from 'express-serve-static-core'
import { GenericResponse } from '../interfaces/generic.response'

export class PrivateController {
  public sendMessage(
    req: Request,
    res: Response<GenericResponse>
  ): Response<GenericResponse> {
    return res.json({
      message: 'Message response for the private route',
    })
  }
}
