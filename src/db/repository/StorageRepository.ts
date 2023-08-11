import { inject, injectable } from 'inversify';
import { Repository } from './Repository';
import { ENTITIES, TYPE } from '../../constants/types';
import { DatabaseConnector } from '../connector';
import { QueryBuilder } from '../utils/QueryBuilder';
import { IQueryFilters, IQuerySearch } from '../../interfaces/api/IQuery';
import { UserRepository } from './UserRepository';
import { HttpError } from '../../errors/types/HttpError';
import { UploadFileDto } from '../../models/CreateFileDto';

@injectable()
export class StorageRepository extends Repository {
  constructor(
    @inject(TYPE.DatabaseConnector) dbConnector: DatabaseConnector,
    @inject(TYPE.QueryBuilder) queryBuilder: QueryBuilder,
    @inject(TYPE.UserRepository) private userRepository: UserRepository,
    @inject(ENTITIES.Storage) tableName: string,
  ) {
    super(dbConnector, queryBuilder, tableName);
  }

  async create(payload: UploadFileDto) {
    const { userId } = payload;
    const isExist = await this.userRepository.getById(userId).catch(err => null);
    if (!isExist) {
      throw new HttpError('Not existing user specified', 400);
    }

    return super.create(payload);
  }

  delete(id: string) {
    return super.delete(id);
  }

  update(id: string, file: UploadFileDto) {
    return super.update(id, file);
  }

  getList(filters: IQueryFilters, search: IQuerySearch) {
    return super.getList(filters, search);
  }

  getById(id: string) {
    return super.getById(id);
  }
}
