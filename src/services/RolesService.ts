import { inject } from 'inversify';
import { TYPE } from '../constants/types';
import { RolesRepository } from '../db/repository/RolesRepository';
import { BaseService } from './BaseService';
import { IPayload } from '../interfaces/api/IPayload';
import { IQueryFilters, IQuerySearch } from '../interfaces/api/IQuery';
import { RolesEntity } from '../db/entities/RolesEntity';
import { RolesPermissionRepository } from '../db/repository/RolesPermissionRepository';

export class RolesService extends BaseService {
  constructor(
    @inject(TYPE.RoleRepository) private repository: RolesRepository,
    @inject(TYPE.RolesPermissionRepository) private rolesPermissionRepository: RolesPermissionRepository,
  ) {
    super();
  }

  async create(role: IPayload) {
    const obj = new RolesEntity(role).toObject();
    const createdRole = await this.repository.create(obj);

    if (role?.assigned_permissions?.length) {
      console.log('test');
    }

    return createdRole;
  }

  delete(id: string) {
    return this.repository.delete(id);
  }

  async update(id: string, permission: any) {
    return this.repository.update(id, permission);
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

  addPermission(id: string, permissions: string[]) {
    const result = permissions.map((permission: string) =>
      this.rolesPermissionRepository.create({ roles_id: id, permissions_id: permission }),
    );

    return Promise.all(result);
  }

  getPermissions(id: string) {
    return this.rolesPermissionRepository.getPermission(id);
  }
}
