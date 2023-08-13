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

export interface IQueryOptions extends IQueryRawOptions {
  table: string;
  type: QueryType;
  excludeReturnFields?: string[];
}
