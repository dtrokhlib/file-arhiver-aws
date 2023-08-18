import { controller, httpPost } from 'inversify-express-utils';
import { inject } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import { BaseController } from './BaseController';
import { AuthPayloadValidation } from '../middlewares/AuthPayloadValidation';
import { TYPE } from '../../../constants/types';
import { AuthenticationService } from '../../../services/auth/AuthenticationService';

@controller('/api/v1/auth')
export class AuthenticationController extends BaseController {
  constructor(@inject(TYPE.AuthenticationService) private service: AuthenticationService) {
    super();
  }

  @httpPost('/authenticate', AuthPayloadValidation)
  async authenticate(req: Request, res: Response, next: NextFunction) {
    try {
      const accessToken = await this.service.authenticate(req.body);
      res.json({ accessToken });
    } catch (error) {
      next(error);
    }
  }
}
