import { injectable } from 'inversify';
import { Pool } from 'pg';
import { DatabaseConnector } from '../connector';
import { IQueryFilters, IQuerySearch } from '../../interfaces/api/IQuery';
import { OrderType } from '../../interfaces/db/OrderType';
import { IQueryOptions } from '../../interfaces/db/QueryOptions';
import { QueryType } from '../../interfaces/db/QueryType';
import { QueryBuilder } from '../utils/QueryBuilder';
import { HttpError } from '../../errors/types/HttpError';

@injectable()
export class Repository {
  protected tableName: string;

  protected queryBuilder: QueryBuilder;

  protected readonly connection: Pool;

  constructor(dbConnector: DatabaseConnector, queryBuilder: QueryBuilder, tableName: string) {
    this.connection = dbConnector.getConnection();
    this.queryBuilder = queryBuilder;
    this.tableName = tableName;
  }

  async create(payload: any) {
    const values = Object.values(payload);
    const queryOptions: IQueryOptions = {
      table: this.tableName,
      type: QueryType.INSERT,
      payload,
    };

    const queryString = this.queryBuilder.buildQuery(queryOptions);
    const [createdRecord] = await this.connection.query(queryString, values).then(res => res.rows);
    return createdRecord;
  }

  protected getList(filters: IQueryFilters, search: IQuerySearch) {
    const queryOptions: IQueryOptions = {
      table: this.tableName,
      type: QueryType.SELECT,
      filters,
      search,
    };

    const queryString = this.queryBuilder.buildQuery(queryOptions);
    return this.connection.query(queryString).then(({ rowCount, rows }) => ({ rowCount, rows }));
  }

  async getById(id: string) {
    const queryOptions: IQueryOptions = {
      table: this.tableName,
      type: QueryType.SELECT,
      search: { id },
    };

    const queryString = this.queryBuilder.buildQuery(queryOptions);
    const [dbRecord] = await this.connection.query(queryString).then(res => res.rows);

    if (!dbRecord) {
      throw new HttpError(`Record with ID {${id}} in ${this.tableName} table, not found.`, 404);
    }

    return dbRecord;
  }

  async update(id: string, payload: any) {
    const queryOptions: IQueryOptions = {
      table: this.tableName,
      type: QueryType.UPDATE,
      search: { id },
      payload,
    };

    const values = Object.values(payload);
    const queryString = this.queryBuilder.buildQuery(queryOptions);
    const [updatedRecord] = await this.connection.query(queryString, values).then(res => res.rows);
    return updatedRecord;
  }

  async delete(id: string) {
    const payload = await this.prepareDeletionPayload(id);
    const queryOptions: IQueryOptions = {
      table: this.tableName,
      type: QueryType.UPDATE,
      search: { id },
      payload,
    };

    const queryString = this.queryBuilder.buildQuery(queryOptions);
    const values = Object.values(payload);
    return this.connection.query(queryString, values);
  }

  async findOneByParams(search: IQuerySearch) {
    const [record] = await this.getList({ limit: '1' }, search).then(res => res.rows);
    return record;
  }

  async verifyContentOwner(user: any, record: any) {
    
  }

  async filterContentByOwner(user: any, records: any) {
    const list = records || [];

  }

  private async prepareDeletionPayload(id: string) {
    const record = await this.getById(id);
    const payload = { ...record, is_deleted: true };

    if (payload.id) {
      delete payload.id;
    }

    return payload;
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
