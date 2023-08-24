import { inject, injectable } from 'inversify';
import { TYPE } from '../constants/types';
import { IQueryFilters, IQuerySearch } from '../interfaces/api/IQuery';
import { BaseService } from './BaseService';
import { PermissionRepository } from '../db/repository/PermissionRepository';
import { PermissionEntity } from '../db/entities/PermissionEntity';
import { IPayload } from '../interfaces/api/IPayload';

@injectable()
export class PermissionService extends BaseService {
  constructor(@inject(TYPE.PermissionRepository) private readonly repository: PermissionRepository) {
    super();
  }

  async create(permission: IPayload) {
    const obj = new PermissionEntity(permission).toObject();
    return this.repository.create(obj);
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
