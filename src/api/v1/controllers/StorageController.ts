import { NextFunction, Request, Response } from 'express';
import { controller, httpDelete, httpGet, httpPost, httpPut } from 'inversify-express-utils';
import { inject } from 'inversify';
import upload from '../../../utils/Uploder';
import { TYPE } from '../../../constants/types';
import { StorageService } from '../../../services/StorageService';
import { BaseController } from './BaseController';
import { IQuery } from '../../../interfaces/api/IQuery';
import { IFile } from '../../../interfaces/api/IFile';
import { AuthProtect } from '../middlewares/AuthProtect';
import { IRequest } from '../../../interfaces/api/IRequest';

@controller('/api/v1/storage')
export class StorageController extends BaseController {
  constructor(@inject(TYPE.StorageService) private service: StorageService) {
    super();
  }

  @httpGet('/', AuthProtect)
  async list(req: IRequest, res: Response, next: NextFunction) {
    try {
      const queries = { ...req.query, is_deleted: false, userid: req.user.id } as IQuery;
      const filters = this.getFilters(queries);
      const search = this.getSearch(queries);
      const files = await this.service.getList(filters, search);
      res.json(files);
    } catch (error) {
      next(error);
    }
  }

  @httpGet('/:id/get-signed-url', AuthProtect)
  async getSignedUrl(req: IRequest, res: Response, next: NextFunction) {
    try {
      const url = await this.service.getSignedUrl(req.user.id, req.params.id);
      res.json(url);
    } catch (error) {
      next(error);
    }
  }

  @httpGet('/:id', AuthProtect)
  async getById(req: IRequest, res: Response, next: NextFunction) {
    try {
      const file = await this.service.getById(req.params.id);
      res.json(file);
    } catch (error) {
      next(error);
    }
  }

  @httpPost('/', AuthProtect, upload.single('file'))
  async create(req: IRequest, res: Response, next: NextFunction) {
    try {
      this.isFileProvided(req);
      const file = await this.service.uploadFile(req.user.id, req.file as IFile);
      res.json(file);
    } catch (error) {
      next(error);
    }
  }

  @httpPut('/:id', AuthProtect, upload.single('file'))
  async update(req: IRequest, res: Response, next: NextFunction) {
    try {
      this.isFileProvided(req);
      const file = await this.service.updateFile(req.params.id, req.user.id, req.file as IFile);
      res.json(file);
    } catch (error) {
      next(error);
    }
  }

  @httpDelete('/:id', AuthProtect)
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await this.service.delete(req.params.id);
      res.status(204).json();
    } catch (error) {
      next(error);
    }
  }
}
