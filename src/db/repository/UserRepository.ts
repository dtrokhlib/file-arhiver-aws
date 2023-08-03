import { inject, injectable } from 'inversify';
import { CreateUserDto } from 'src/models/CreateUserDto';
import { Repository } from './Repository';
import TYPE from '../../constants/types';
import { DatabaseConnector } from '../connector';
import { IQueryFilters, IQuerySearch } from '../../interfaces/api/IQuery';
import { QueryBuilder } from '../utils/QueryBuilder';
import { QueryType } from '../../interfaces/db/QueryType';
import { IQueryOptions } from '../../interfaces/db/QueryOptions';
import { HttpError } from '../../errors/types/HttpError';

@injectable()
export class UserRepository extends Repository {
  protected table = 'users';

  constructor(
    @inject(TYPE.DatabaseConnector) dbConnector: DatabaseConnector,
    @inject(TYPE.QueryBuilder) protected queryBuilder: QueryBuilder,
  ) {
    super(dbConnector);
  }

  async create(user: CreateUserDto) {
    const queryOptions: IQueryOptions = {
      table: this.table,
      type: QueryType.INSERT,
      payload: user,
    };

    const values = Object.values(user);
    const queryString = this.queryBuilder.buildQuery(queryOptions);
    const [createdUser] = await this.connection.query(queryString, values).then(res => res.rows);
    return createdUser;
  }

  async delete(id: string) {
    const user = await this.getById(id);
    const payload = { ...user, is_deleted: true };
    delete payload.id;

    const queryOptions: IQueryOptions = {
      table: this.table,
      type: QueryType.UPDATE,
      search: { id },
      payload,
    };

    const queryString = this.queryBuilder.buildQuery(queryOptions);
    const values = Object.values(payload);

    return this.connection.query(queryString, values);
  }

  async update(id: string, user: CreateUserDto) {
    const queryOptions: IQueryOptions = {
      table: this.table,
      type: QueryType.UPDATE,
      payload: user,
      search: { id },
    };

    const values = Object.values(user);
    const queryString = this.queryBuilder.buildQuery(queryOptions);
    const [updatedUser] = await this.connection.query(queryString, values).then(res => res.rows);
    return updatedUser;
  }

  getList(filters: IQueryFilters, search: IQuerySearch) {
    const queryOptions: IQueryOptions = {
      table: this.table,
      type: QueryType.SELECT,
      filters,
      search,
    };

    const queryString = this.queryBuilder.buildQuery(queryOptions);
    return this.connection.query(queryString).then(res => res.rows);
  }

  async getById(id: string) {
    const queryOptions: IQueryOptions = {
      table: this.table,
      type: QueryType.SELECT,
      search: { id },
    };

    const queryString = this.queryBuilder.buildQuery(queryOptions);
    const [user] = await this.connection.query(queryString).then(res => res.rows);

    if (!user) {
      throw new HttpError('User not found', 404);
    }

    return user;
  }
}
