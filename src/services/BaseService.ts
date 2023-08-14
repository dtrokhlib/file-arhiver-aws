import { injectable } from 'inversify';
import { HttpError } from '../errors/types/HttpError';

@injectable()
export class BaseService {
  protected isRecordOwner(userId: string, entity: any) {
    if (userId !== entity?.userid) {
      throw new HttpError('Not Authorized', 401);
    }
    return entity;
  }
}
