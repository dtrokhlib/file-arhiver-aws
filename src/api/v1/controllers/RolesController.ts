import { inject } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import { controller, httpDelete, httpGet, httpPost, httpPut } from 'inversify-express-utils';
import { TYPE } from '../../../constants/types';
import { BaseController } from './BaseController';
import { IQuery } from '../../../interfaces/api/IQuery';
import { RolesService } from '../../../services/RolesService';

@controller('/api/v1/roles')
export class RolesController extends BaseController {
  constructor(@inject(TYPE.RolesService) private readonly service: RolesService) {
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

  @httpPost('/')
  async create({ body }: Request, res: Response, next: NextFunction) {
    try {
      const permission = await this.service.create(body);
      res.json(permission);
    } catch (error) {
      next(error);
    }
  }

  @httpPut('/:id')
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const role = await this.service.update(req.params.id, req.body);
      res.json(role);
    } catch (error) {
      next(error);
    }
  }

  @httpDelete('/:id')
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await this.service.delete(req.params.id);
      res.status(204).json();
    } catch (error) {
      next(error);
    }
  }

  @httpPost('/:id/add-permissions')
  async assignPermissions(req: Request, res: Response, next: NextFunction) {
    try {
      const role = await this.service.addPermission(req.params.id, req.body);
      res.send(role);
    } catch (error) {
      next(error);
    }
  }

  @httpGet('/:id/get-permissions')
  async getPermissions(req: Request, res: Response, next: NextFunction) {
    try {
      const role = await this.service.getPermissions(req.params.id);
      res.send(role);
    } catch (error) {
      next(error);
    }
  }
}
