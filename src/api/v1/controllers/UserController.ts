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
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  @httpGet('/:id')
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.repository.getById(req.params.id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  @httpPost('/', CreateUserValidator)
  create({ body }: Request, res: Response, next: NextFunction) {
    return this.repository.create(body).then(res.json).catch(next);
  }

  @httpPut('/:id')
  updateById(req: Request, res: Response, next: NextFunction) {
    res.send('update by id');
  }

  @httpDelete('/:id')
  async deleteById(req: Request, res: Response, next: NextFunction) {
    try {
      await this.repository.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
