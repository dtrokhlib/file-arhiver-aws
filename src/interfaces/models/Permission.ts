import { EntityAction, EntityType } from '../../constants/enums/entity';

export type ListItem = {
  [key in EntityType]: EntityAction[];
};

export interface IPermission {
  name: string;
  list: ListItem[];
}
