import { IQueryFilters, IQuerySearch } from '../api/IQuery';
import { QueryType } from './QueryType';

export interface IKeyValuePair {
  [key: string]: number | boolean | string;
}

export interface IQueryRawOptions {
  filters?: IQueryFilters;
  search?: IQuerySearch;
  payload?: any;
}

export enum JoinType {
  INNER = 'INNER',
}

export interface IJoin {
  type: JoinType;
  tableToJoin: string;
  joinField: string;
  originField: string;
}

export interface IQueryOptions extends IQueryRawOptions {
  table: string;
  type: QueryType;
  excludeReturnFields?: string[];
  join?: IJoin;
}
