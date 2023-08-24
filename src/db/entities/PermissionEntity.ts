import { IPayload } from 'src/interfaces/api/IPayload';
import { Entity } from './Entity';
import { EntityAction, EntityType } from '../../constants/enums/entity';
import { HttpError } from '../../errors/types/HttpError';
import { IPermission } from '../../interfaces/models/Permission';

const ERROR_MSG = {
  MISSED_PARAMETER: 'Name and list must be provided',
  NOT_VALID_STRUCTURE: `List should have only following keys ${Object.values(EntityType)} and values ${Object.values(
    EntityAction,
  )}`,
};

export class PermissionEntity extends Entity {
  private entity: IPermission;

  constructor(payload: IPayload) {
    super();
    this.validate(payload);
    this.entity = payload as IPermission;
  }

  validate(payload: IPayload) {
    const { name, list } = payload || {};

    if (!name || !list) {
      throw new HttpError(ERROR_MSG.MISSED_PARAMETER, 400);
    }

    if (!this.isValidPermissionStructure(list)) {
      throw new HttpError(ERROR_MSG.NOT_VALID_STRUCTURE, 400);
    }
  }

  toObject() {
    return {
      ...this.entity,
    };
  }

  private isValidPermissionStructure(list: any) {
    const keys = Object.keys(list);
    return keys.every(
      (key: any) =>
        Object.values(EntityType).includes(key) &&
        list[key].every((action: any) => Object.values(EntityAction).includes(action)),
    );
  }
}
