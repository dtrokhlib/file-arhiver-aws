import { inject, injectable } from 'inversify';
import { CreateUserDto } from 'src/models/CreateUserDto';
import { Repository } from './Repository';
import { ENTITIES, TYPE } from '../../constants/types';
import { DatabaseConnector } from '../connector';
import { QueryBuilder } from '../utils/QueryBuilder';
import { IQueryFilters, IQuerySearch } from '../../interfaces/api/IQuery';

@injectable()
export class StorageRepository extends Repository {
  constructor(
    @inject(TYPE.DatabaseConnector) dbConnector: DatabaseConnector,
    @inject(TYPE.QueryBuilder) queryBuilder: QueryBuilder,
    @inject(ENTITIES.Storage) tableName: string,
  ) {
    super(dbConnector, queryBuilder, tableName);
  }

  create(file: any) {
    return super.create(file);
  }

  delete(id: string) {
    return super.delete(id);
  }

  update(id: string, file: any) {
    return super.update(id, file);
  }

  getList(filters: IQueryFilters, search: IQuerySearch) {
    return super.getList(filters, search);
  }

  getById(id: string) {
    return super.getById(id);
  }
}
