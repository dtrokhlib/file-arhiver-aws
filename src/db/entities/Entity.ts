import { IPayload } from '../../interfaces/api/IPayload';

export abstract class Entity {
  abstract validate(payload: IPayload): any;
  abstract toObject(): any;
}
