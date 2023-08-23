import { inject, injectable } from 'inversify';
import { TYPE } from '../constants/types';
import { IQueryFilters, IQuerySearch } from '../interfaces/api/IQuery';
import { BaseService } from './BaseService';
import { PermissionRepository } from '../db/repository/PermissionRepository';
import { PermissionEntity } from '../db/entities/PermissionEntity';
import { EntityAction, EntityType } from '../constants/enums/entity';
import { IPayload } from '../interfaces/api/IPayload';

@injectable()
export class PermissionService extends BaseService {
  constructor(@inject(TYPE.UserRepository) private readonly repository: PermissionRepository) {
    super();
  }

  async create(permission: IPayload) {
    // const preparedData = await this.prepareAndValidatePayload(permission);
    const entity = new PermissionEntity(permission);
    return entity;
    // return this.repository.create(preparedData);
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
        Object.values(EntityType).includes(key) &&
        permissionList[key].every((action: any) => Object.values(EntityAction).includes(action)),
    );
  }
}
