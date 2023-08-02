import { IQueryFilters, IQuerySearch } from '../api/IQuery';
import { QueryType } from './QueryType';

export interface IKeyValuePair {
  [key: string]: number | boolean | string;
}
export interface IQueryOptions {
  table: string;
  type: QueryType;
  filters?: IQueryFilters;
  search?: IQuerySearch;
  payload?: any;
}
