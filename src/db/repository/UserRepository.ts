import { inject, injectable } from 'inversify';
import { CreateUserDto } from 'src/models/CreateUserDto';
import { Repository } from './Repository';
import { ENTITIES, EXCLUDED_FIELDS, TYPE } from '../../constants/types';
import { DatabaseConnector } from '../connector';
import { QueryBuilder } from '../utils/QueryBuilder';
import { IQueryFilters, IQuerySearch } from '../../interfaces/api/IQuery';

@injectable()
export class UserRepository extends Repository {
  constructor(
    @inject(TYPE.DatabaseConnector) dbConnector: DatabaseConnector,
    @inject(TYPE.QueryBuilder) queryBuilder: QueryBuilder,
    @inject(ENTITIES.User) tableName: string,
    @inject(EXCLUDED_FIELDS.User) excludeReturnFields: string[],
  ) {
    super(dbConnector, queryBuilder, { tableName, excludeReturnFields });
  }

  async create(user: CreateUserDto) {
    return super.create(user);
  }

  delete(id: string) {
    return super.delete(id);
  }

  async update(id: string, user: CreateUserDto) {
    return super.update(id, user);
  }

  getList(filters: IQueryFilters, search: IQuerySearch) {
    return super.getList(filters, search);
  }

  getById(id: string) {
    return super.getById(id);
  }

  findOneByParams(search: IQuerySearch) {
    return super.findOneByParams(search);
  }
}
