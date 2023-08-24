import { inject } from 'inversify';
import { TYPE } from '../constants/types';
import { RolesRepository } from '../db/repository/RolesRepository';
import { BaseService } from './BaseService';
import { IPayload } from '../interfaces/api/IPayload';
import { IQueryFilters, IQuerySearch } from '../interfaces/api/IQuery';
import { RolesEntity } from '../db/entities/RolesEntity';

export class RolesService extends BaseService {
  constructor(@inject(TYPE.RoleRepository) private repository: RolesRepository) {
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
}
