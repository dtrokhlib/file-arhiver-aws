import { inject } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import { controller, httpDelete, httpGet, httpPost, httpPut } from 'inversify-express-utils';
import { CreateUserValidator } from '../middlewares/CreateUserValidator';
import { TYPE } from '../../../constants/types';
import { BaseController } from './BaseController';
import { IQuery } from '../../../interfaces/api/IQuery';
import { UserService } from '../../../services/UserService';

@controller('/api/v1/user')
export class UserController extends BaseController {
  constructor(@inject(TYPE.UserService) private readonly service: UserService) {
    super();
  }

  @httpGet('/')
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const queries = { ...req.query, is_deleted: false } as IQuery;
      const filters = this.getFilters(queries);
      const search = this.getSearch(queries);
      const users = await this.service.getList(filters, search);
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  @httpGet('/:id')
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.service.getById(req.params.id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  @httpPost('/', CreateUserValidator)
  async create({ body }: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.service.create(body);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  @httpPut('/:id', CreateUserValidator)
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.service.update(req.params.id, req.body);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  @httpDelete('/:id')
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await this.service.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
