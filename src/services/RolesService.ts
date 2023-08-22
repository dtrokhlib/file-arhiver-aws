import { inject } from 'inversify';
import { TYPE } from '../constants/types';
import { RolesRepository } from '../db/repository/RolesRepository';
import { BaseService } from './BaseService';

export class RolesService extends BaseService {
  constructor(@inject(TYPE.RoleRepository) private repository: RolesRepository) {
    super();
  }
}
