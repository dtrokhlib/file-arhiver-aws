import { inject, injectable } from 'inversify';
import { CreateUserDto } from 'src/models/CreateUserDto';
import { Repository } from './Repository';
import TYPE from '../../constants/types';
import { DatabaseConnector } from '../connector';
import { IQueryFilters, IQuerySearch } from '../../interfaces/api/IQuery';
import { QueryBuilder } from '../utils/QueryBuilder';
import { QueryType } from '../../interfaces/db/QueryType';
import { IQueryOptions } from '../../interfaces/db/QueryOptions';

@injectable()
export class UserRepository extends Repository {
  protected table = 'users';

  constructor(
    @inject(TYPE.DatabaseConnector) dbConnector: DatabaseConnector,
    @inject(TYPE.QueryBuilder) protected queryBuilder: QueryBuilder,
  ) {
    super(dbConnector);
  }

  create(user: CreateUserDto) {
    // const { query, values } = this.queryBuilder(this.table, user);
    // return this.connection.query(query, values);
    return {};
  }

  delete() {
    return new Promise((res, rej) => {
      res(1);
    });
  }

  update() {
    return new Promise((res, rej) => {
      res(1);
    });
  }

  async getList(filters: IQueryFilters, search: IQuerySearch) {
    const queryOptions: IQueryOptions = {
      table: this.table,
      type: QueryType.SELECT,
      filters,
      search,
    };
    const queryString = this.queryBuilder.buildQuery(queryOptions);
    return this.connection.query(queryString).then(users => users.rows);
  }

  getById(id: number) {
    return new Promise((res, rej) => {
      res(1);
    });
  }
}
