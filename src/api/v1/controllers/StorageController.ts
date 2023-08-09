import { NextFunction, Request, Response } from 'express';
import { controller, httpDelete, httpGet, httpPost, httpPut } from 'inversify-express-utils';
import { inject } from 'inversify';
import upload from '../../../utils/Uploder';
import { TYPE } from '../../../constants/types';
import { StorageService } from '../../../services/StorageService';
import { StorageRepository } from '../../../db/repository/StorageRepository';
import { BaseController } from './BaseController';
import { IQuery } from '../../../interfaces/api/IQuery';
import { IFile } from '../../../interfaces/api/IFile';
import { AuthProtect } from '../middlewares/AuthProtect';
import { IRequest } from '../../../interfaces/api/IRequest';

@controller('/api/v1/storage')
export class StorageController extends BaseController {
  constructor(
    @inject(TYPE.StorageService) private service: StorageService,
    @inject(TYPE.StorageRepository) private repository: StorageRepository,
  ) {
    super();
  }

  @httpGet('/', AuthProtect)
  async list(req: IRequest, res: Response, next: NextFunction) {
    try {
      console.log(req.user);
      const queries = { ...req.query, is_deleted: false } as IQuery;
      const filters = this.getFilters(queries);
      const search = this.getSearch(queries);
      const files = await this.repository.getList(filters, search);
      res.json(files);
    } catch (error) {
      next(error);
    }
  }

  @httpGet('/:id/get-signed-url')
  async getSignedUrl(req: IRequest, res: Response, next: NextFunction) {
    try {
      const url = await this.service.getSignedUrl(req.params.id);
      res.send(url);
    } catch (error) {
      next(error);
    }
  }

  @httpGet('/:id')
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const file = await this.repository.getById(req.params.id);
      res.json(file);
    } catch (error) {
      next(error);
    }
  }

  @httpPost('/', upload.single('file'))
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      this.isFileProvided(req);
      const userId = '3';
      const file = await this.service.uploadFile(userId, req.file as IFile);
      res.send(file);
    } catch (error) {
      next(error);
    }
  }

  @httpPut('/:id', upload.single('file'))
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      this.isFileProvided(req);
      const userId = '3';
      const file = await this.service.updateFile(req.params.id, userId, req.file as IFile);
      res.send(file);
    } catch (error) {
      next(error);
    }
  }

  @httpDelete('/:id')
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await this.repository.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
