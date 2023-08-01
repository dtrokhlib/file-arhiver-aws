import { OrderType } from '../db/OrderType';

export interface IQuery {
  [key: string]: string;
}

export interface IQueryFilters {
  offset?: string;
  limit?: string;
  orderBy?: string;
  orderType?: OrderType;
}

export interface IQuerySearch {
  [key: string]: string;
}
