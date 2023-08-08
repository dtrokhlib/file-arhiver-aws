import { controller, httpPost } from 'inversify-express-utils';
import { inject } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import { BaseController } from './BaseController';
import { AuthenticationValidator } from '../middlewares/AuthenticationValidator';
import { TYPE } from '../../../constants/types';
import { AuthenticationService } from '../../../services/auth/AuthenticationService';

@controller('/api/v1/auth')
export class AuthenticationController extends BaseController {
  constructor(@inject(TYPE.AuthenticationService) private service: AuthenticationService) {
    super();
  }

  @httpPost('/authenticate', AuthenticationValidator)
  async authenticate(req: Request, res: Response, next: NextFunction) {
    try {
      const accessToken = await this.service.authenticate(req.body);
      res.send({ accessToken });
    } catch (error) {
      next(error);
    }
  }
}
