import { IPayload } from 'src/interfaces/api/IPayload';
import { Entity } from './Entity';
import { IRole } from '../../interfaces/models/Role';
import { HttpError } from '../../errors/types/HttpError';

const ERROR_MSG = {
  MISSED_PARAMETER: 'Name must be provided',
};

export class RolesEntity extends Entity {
  entity: IRole;

  constructor(payload: IPayload) {
    super();
    this.validate(payload);
    this.entity = payload as IRole;
  }

  validate(payload: IPayload) {
    if (!payload?.name) {
      throw new HttpError(ERROR_MSG.MISSED_PARAMETER, 400);
    }
  }

  toObject() {
    return {
      ...this.entity,
    };
  }
}
