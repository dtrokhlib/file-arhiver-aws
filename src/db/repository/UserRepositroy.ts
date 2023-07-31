import { inject, injectable } from 'inversify';
import { CreateUserDto } from 'src/models/CreateUserDto';
import { IQueryFilters, Repository } from './Repository';
import TYPE from '../../constants/types';
import { DatabaseConnector } from '../connector';

@injectable()
export class UserRepository extends Repository {
  protected table = 'users';

  constructor(@inject(TYPE.DatabaseConnector) dbConnector: DatabaseConnector) {
    super(dbConnector);
  }

  create(user: CreateUserDto) {
    const { query, values } = this.queryBuilder(this.table, user);
    return this.connection.query(query, values);
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

  async getList(filters: IQueryFilters, search: any) {
    return this.connection
      .query(`SELECT * FROM ${this.table} ${this.processFilters(filters)}`)
      .then(users => users.rows);
  }

  getById(id: number) {
    return new Promise((res, rej) => {
      res(1);
    });
  }
}
