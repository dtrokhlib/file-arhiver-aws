import { injectable } from 'inversify';
import { OrderType } from '../../interfaces/db/OrderType';
import { IQueryFilters, IQuerySearch } from '../../interfaces/api/IQuery';
import { IQueryOptions } from '../../interfaces/db/QueryOptions';
import { QueryType } from '../../interfaces/db/QueryType';

@injectable()
export class QueryBuilder {
  public buildQuery(options: IQueryOptions) {
    switch (options.type) {
      case QueryType.SELECT:
        return this.createSelectQuery(options);
      case QueryType.INSERT:
        return this.createInsertQuery(options);
      case QueryType.DELETE:
        return this.createDeleteQuery(options);
      default:
        return '';
    }
  }

  private createSelectQuery(options: IQueryOptions) {
    const { table } = options;
    const query = this.assignFiltersAndSearch(`SELECT * FROM ${table}`, options);
    return query;
  }

  private assignFiltersAndSearch(query: string, { search, filters }: IQueryOptions) {
    let updatedQuery = query;

    if (search) {
      updatedQuery = updatedQuery.concat(' ', this.processSearch(search));
    }

    if (filters) {
      updatedQuery = updatedQuery.concat(' ', this.processFilters(filters));
    }

    return updatedQuery;
  }

  private createInsertQuery(options: IQueryOptions) {
    const { table, payload } = options;
    const values = Object.values(payload);
    const keys = Object.keys(payload);
    const joinedFieldValues = this.processFieldValues(values);
    const joinedFieldKeys = this.processFieldKeys(keys);

    const query = `INSERT INTO ${table} (${joinedFieldKeys}) values (${joinedFieldValues}) RETURNING *`;
    return query;
  }

  private createDeleteQuery(options: IQueryOptions) {
    const { table } = options;
    const query = this.assignFiltersAndSearch(`DELETE FROM ${table}`, options);
    return query;
  }

  private processFieldValues(values: any[]) {
    const indexEnum = Array.from(values, (x, index) => index + 1);
    return `$${indexEnum.join(', $')}`;
  }

  private processFieldKeys(keys: any[]) {
    return keys.join(', ');
  }

  private processFilters(filters: IQueryFilters) {
    const { offset, limit, orderBy, orderType } = filters;
    const filterQueries: string[] = [];

    if (orderBy) {
      filterQueries.push(`ORDER BY ${orderBy} ${orderType || OrderType.ASC}`);
    }

    if (limit) {
      filterQueries.push(`LIMIT ${limit}`);
    }

    if (offset) {
      filterQueries.push(`OFFSET ${offset}`);
    }

    return filterQueries.join(' ');
  }

  private processSearch(search: IQuerySearch) {
    const searchQueries: string[] = [];

    Object.entries(search).forEach(([field, value]) => {
      searchQueries.push(`${field}='${value}'`);
    });

    return searchQueries.length ? `WHERE ${searchQueries.join(' AND ')}` : '';
  }
}
