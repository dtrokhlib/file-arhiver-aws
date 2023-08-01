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

  abstract delete(): Promise<any>;

  abstract update(): Promise<any>;

  abstract getList(filters: any, options: any): Promise<any>;

  abstract getById(id: number): Promise<any>;

  // protected queryBuilder(table: string, object: any) {
  //   const values = Object.values(object);
  //   const keys = Object.keys(object);
  //   const valuesEnum = this.buildEnumQueryPart(values);
  //   const keysEnum = this.buildKeysQueryPart(keys);

  //   const query = `INSERT INTO ${table} (${keysEnum}) values (${valuesEnum}) RETURNING *`;

  //   return { query, values };
  // }

  private buildEnumQueryPart(values: any[]) {
    return values.reduce((summ, current, index) => {
      const order = index + 1;
      return summ ? `${summ}, $${order}` : `$${order}`;
    }, '');
  }

  private buildKeysQueryPart(keys: any[]) {
    return keys.reduce((summ, current) => (summ ? `${summ}, ${current}` : `${current}`), '');
  }

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
