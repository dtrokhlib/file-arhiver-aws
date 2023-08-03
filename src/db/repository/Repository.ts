import { injectable } from 'inversify';
import { Pool } from 'pg';
import { DatabaseConnector } from '../connector';
import { IQueryFilters, IQuerySearch } from '../../interfaces/api/IQuery';
import { OrderType } from '../../interfaces/db/OrderType';

@injectable()
export abstract class Repository {
  protected readonly connection: Pool;

  constructor(dbConnector: DatabaseConnector) {
    this.connection = dbConnector.getConnection();
  }

  abstract create(entity: any): any;

  abstract delete(id: string): Promise<any>;

  abstract update(id: string, entity: any): Promise<any>;

  abstract getList(filters: any, options: any): Promise<any>;

  abstract getById(id: string): Promise<any>;

  protected processFilters(filters: IQueryFilters) {
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

  protected processSearch(search: IQuerySearch) {
    const searchQueries: string[] = [];

    Object.entries(search).forEach(([field, value]) => {
      searchQueries.push(`${field} = ${value}`);
    });

    return searchQueries.join(' ');
  }
}
