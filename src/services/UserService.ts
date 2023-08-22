import { inject, injectable } from 'inversify';
import { genSalt, hash } from 'bcrypt';
import { TYPE } from '../constants/types';
import { UserRepository } from '../db/repository/UserRepository';
import { CreateUserDto } from '../models/CreateUserDto';
import { IQueryFilters, IQuerySearch } from '../interfaces/api/IQuery';
import { ConfigService } from '../config';
import { BaseService } from './BaseService';

@injectable()
export class UserService extends BaseService {
  constructor(
    @inject(TYPE.ConfigService) private readonly config: ConfigService,
    @inject(TYPE.UserRepository) private readonly repository: UserRepository,
  ) {
    super();
  }

  async create(user: CreateUserDto) {
    const preparedData = await this.prepareUserData(user);
    return this.repository.create(preparedData);
  }

  delete(id: string) {
    return this.repository.delete(id);
  }

  async update(id: string, user: CreateUserDto) {
    const preparedData = await this.prepareUserData(user);
    return this.repository.update(id, preparedData);
  }

  getList(filters: IQueryFilters, search: IQuerySearch) {
    return this.repository.getList(filters, search);
  }

  getById(id: string) {
    return this.repository.getById(id);
  }

  findOneByParams(search: IQuerySearch) {
    return this.repository.findOneByParams(search);
  }

  private async prepareUserData(user: CreateUserDto) {
    if (user?.password) {
      const hashedPassword = await this.hashPassword(user.password);
      Object.assign(user, { password: hashedPassword });
    }
    return user;
  }

  private async hashPassword(password: string) {
    const saltRounds = this.config.getByKey('auth')?.saltRounds || 10;
    const salt = await genSalt(saltRounds);
    return hash(password, salt);
  }
}
