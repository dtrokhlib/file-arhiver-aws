import { NextFunction, Request, Response } from 'express';
import { controller, httpDelete, httpGet, httpPost, httpPut } from 'inversify-express-utils';
import { inject } from 'inversify';
import upload from '../../../utils/Uploder';
import { TYPE } from '../../../constants/types';
import { StorageService } from '../../../services/StorageService';
import { HttpError } from '../../../errors/types/HttpError';

@controller('/api/v1/storage')
export class StorageController {
  constructor(@inject(TYPE.StorageService) private storageService: StorageService) {}

  @httpGet('/')
  list(req: Request, res: Response, next: NextFunction) {
    return res.send('list');
  }

  @httpGet('/:id')
  getById(req: Request, res: Response, next: NextFunction) {
    return res.send('get by id');
  }

  @httpPost('/', upload.single('file'))
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw new HttpError('File was not provided', 400);
      }
      const file = await this.storageService.uploadFileToBucket(req.file);
      res.send(file);
    } catch (error) {
      next(error);
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
