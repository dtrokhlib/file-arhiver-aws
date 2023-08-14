import { inject, injectable } from 'inversify';
import { Repository } from './Repository';
import { ENTITIES, TYPE } from '../../constants/types';
import { DatabaseConnector } from '../connector';
import { QueryBuilder } from '../utils/QueryBuilder';
import { IQueryFilters, IQuerySearch } from '../../interfaces/api/IQuery';
import { UploadFileDto } from '../../models/CreateFileDto';

@injectable()
export class StorageRepository extends Repository {
  constructor(
    @inject(TYPE.DatabaseConnector) dbConnector: DatabaseConnector,
    @inject(TYPE.QueryBuilder) queryBuilder: QueryBuilder,
    @inject(ENTITIES.Storage) tableName: string,
  ) {
    super(dbConnector, queryBuilder, { tableName });
  }

  async create(payload: UploadFileDto) {
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
