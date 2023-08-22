import { inject, injectable } from 'inversify';
import { TYPE } from '../constants/types';
import { IQueryFilters, IQuerySearch } from '../interfaces/api/IQuery';
import { ConfigService } from '../config';
import { BaseService } from './BaseService';
import { PermissionRepository } from '../db/repository/PermissionRepository';

enum Entity {
  FILE = 'file',
  USER = 'user',
  ROLES = 'roles',
  PERMISSION = 'permission',
}
enum Action {
  READ = 'read',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  READ_ALL = 'read_all',
  CREATE_ALL = 'create_all',
  UPDATE_ALL = 'update_all',
  DELETE_ALL = 'delete_all',
}

@injectable()
export class PermissionService extends BaseService {
  constructor(
    @inject(TYPE.ConfigService) private readonly config: ConfigService,
    @inject(TYPE.UserRepository) private readonly repository: PermissionRepository,
  ) {
    super();
  }

  async create(permission: any) {
    const preparedData = await this.prepareAndValidatePayload(permission);
    return this.repository.create(preparedData);
  }

  delete(id: string) {
    return this.repository.delete(id);
  }

  async update(id: string, permission: any) {
    const preparedData = await this.prepareAndValidatePayload(permission);
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

  private async prepareAndValidatePayload(permission: any) {
    console.log(permission);
    console.log(this.isValidPermission(permission.list));

    return permission;
  }

  isValidPermission(permissionList: any) {
    const keys = Object.keys(permissionList);
    return keys.every(
      (key: any) =>
        Object.values(Entity).includes(key) &&
        permissionList[key].every((action: any) => Object.values(Action).includes(action)),
    );
  }
}
