import { NextFunction, Request, Response } from 'express';
import { controller, httpDelete, httpGet, httpPost, httpPut } from 'inversify-express-utils';
// import { Storage } from '../../../connectors/StorageConnector';

@controller('/api/v1/storage')
export class StorageController {
  // constructor(private readonly storageConnector: Storage) {}

  @httpGet('/')
  list(req: Request, res: Response, next: NextFunction) {
    return res.send('list');
  }

  @httpGet('/:id')
  getById(req: Request, res: Response, next: NextFunction) {
    return res.send('get be id');
  }

  @httpPost('/')
  create(req: Request, res: Response, next: NextFunction) {
    return res.send('create');
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
