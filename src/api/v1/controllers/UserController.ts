import { inject } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import { controller, httpDelete, httpGet, httpPost, httpPut } from 'inversify-express-utils';
import { UserRepository } from '../../../db/repository/UserRepository';
import { CreateUserValidator } from '../middlewares/CreateUserValidator';
import TYPE from '../../../constants/types';
import { BaseController } from './BaseController';
import { IQuery } from '../../../interfaces/api/IQuery';

@controller('/api/v1/user')
export class UserController extends BaseController {
  constructor(@inject(TYPE.UserRepository) private readonly repository: UserRepository) {
    super();
  }

  @httpGet('/')
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const queries = req.query as IQuery;
      const filters = this.getFilters(queries);
      const search = this.getSearch(queries);

      const users = await this.repository.getList(filters, search);
      return res.send(users);
    } catch (error) {
      console.log('Get Users List Error: ', error);
      return next(error);
    }
  }

  @httpGet('/:id')
  getById(req: Request, res: Response, next: NextFunction) {
    return res.send('get be id');
  }

  @httpPost('/', CreateUserValidator)
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.repository.create(req.body);
      return res.send(user);
    } catch (error) {
      console.log('Create User Error: ', error);
      return next(error);
    }
  }

  @httpPut('/:id')
  updateById(req: Request, res: Response, next: NextFunction) {
    return res.send('update by id');
  }

  @httpDelete('/:id')
  deleteById(req: Request, res: Response, next: NextFunction) {
    return res.send('delete by id');
  }
}
