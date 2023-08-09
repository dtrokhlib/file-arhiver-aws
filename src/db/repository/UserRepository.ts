import { inject, injectable } from 'inversify';
import { genSalt, hash } from 'bcrypt';
import { CreateUserDto } from 'src/models/CreateUserDto';
import { Repository } from './Repository';
import { ENTITIES, TYPE } from '../../constants/types';
import { DatabaseConnector } from '../connector';
import { QueryBuilder } from '../utils/QueryBuilder';
import { IQueryFilters, IQuerySearch } from '../../interfaces/api/IQuery';
import { ConfigService } from '../../config';

@injectable()
export class UserRepository extends Repository {
  constructor(
    @inject(TYPE.ConfigService) private readonly config: ConfigService,
    @inject(TYPE.DatabaseConnector) dbConnector: DatabaseConnector,
    @inject(TYPE.QueryBuilder) queryBuilder: QueryBuilder,
    @inject(ENTITIES.User) tableName: string,
  ) {
    super(dbConnector, queryBuilder, tableName);
  }

  async create(user: CreateUserDto) {
    Object.assign(user, await this.hashPassword(user.password));
    return super.create(user);
  }

  delete(id: string) {
    return super.delete(id);
  }

  async update(id: string, user: CreateUserDto) {
    Object.assign(user, await this.hashPassword(user.password));
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

  private async hashPassword(password: string) {
    if (password) {
      const saltRounds = this.config.getByKey('auth')?.saltRounds || 10;
      const salt = await genSalt(saltRounds);
      const hashedPassword = await hash(password, salt);
      return { password: hashedPassword };
    }
    return {};
  }
}
