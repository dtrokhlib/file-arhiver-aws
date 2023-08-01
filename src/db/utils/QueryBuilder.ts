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
      default:
        return '';
    }
  }

  private createSelectQuery(options: IQueryOptions) {
    const { table, filters, search } = options;
    let query = `SELECT * FROM ${table}`;

    if (search) {
      query = query.concat(' ', this.processSearch(search));
    }

    if (filters) {
      query = query.concat(' ', this.processFilters(filters));
    }

    return query;
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
