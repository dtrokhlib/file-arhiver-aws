import { injectable } from 'inversify';
import { Request } from 'express';
import { HttpError } from '../../../errors/types/HttpError';
import { IQuery } from '../../../interfaces/api/IQuery';

const filterKeys: string[] = ['offset', 'limit', 'orderBy', 'orderType'];

@injectable()
export class BaseController {
  protected isRecordOwner(userId: string, entity: any) {
    if (userId !== entity?.userid) {
      throw new HttpError('Not Authorized', 401);
    }
    return entity;
  }

  protected getFilters(query: IQuery) {
    const filters = {};

    Object.entries(query).forEach(([key, value]) => {
      if (filterKeys.includes(key)) {
        Object.assign(filters, { [key]: value });
      }
    });

    return filters;
  }

  protected getSearch(query: IQuery) {
    const search = {};

    Object.entries(query).forEach(([key, value]) => {
      if (!filterKeys.includes(key)) {
        Object.assign(search, { [key]: value });
      }
    });

    return search;
  }

  protected isFileProvided(req: Request) {
    if (!req.file) {
      throw new HttpError('File was not provided', 400);
    }
  }
}
