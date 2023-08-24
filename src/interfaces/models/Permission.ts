import { EntityAction, EntityType } from '../../constants/enums/entity';

export type ListItem = {
  [key in EntityType]: EntityAction[];
};

export interface IPermission {
  id?: number;
  name: string;
  list: ListItem[];
  is_deleted?: boolean;
}
