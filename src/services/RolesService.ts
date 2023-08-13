import { inject } from 'inversify';
import { TYPE } from '../constants/types';
import { RolesRepository } from '../db/repository/RolesRepository';

export class RolesService {
  constructor(@inject(TYPE.RoleRepository) private repository: RolesRepository) {}
}
