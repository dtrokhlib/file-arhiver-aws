import { injectable } from 'inversify';
import { Pool } from 'pg';
import { DatabaseConnector } from '../connector';
import { IQueryFilters, IQuerySearch } from '../../interfaces/api/IQuery';
import { IQueryOptions, IQueryRawOptions } from '../../interfaces/db/QueryOptions';
import { QueryType } from '../../interfaces/db/QueryType';
import { QueryBuilder } from '../utils/QueryBuilder';
import { HttpError } from '../../errors/types/HttpError';
import { EntityConfig } from '../../interfaces/db/EntityConfig';

@injectable()
export class Repository {
  protected entityConfig: EntityConfig;

  protected queryBuilder: QueryBuilder;

  protected readonly connection: Pool;

  constructor(dbConnector: DatabaseConnector, queryBuilder: QueryBuilder, entityConfig: EntityConfig) {
    this.connection = dbConnector.getConnection();
    this.queryBuilder = queryBuilder;
    this.entityConfig = entityConfig;
  }

  async create(payload: any) {
    const queryOptions = this.buildQueryOptions(QueryType.INSERT, { payload });
    const queryString = this.queryBuilder.buildQuery(queryOptions);
    const [createdRecord] = await this.executeQuery(queryString, payload);
    return createdRecord;
  }

  getList(filters: IQueryFilters, search: IQuerySearch) {
    const queryOptions = this.buildQueryOptions(QueryType.SELECT, { filters, search });
    const queryString = this.queryBuilder.buildQuery(queryOptions);
    return this.executeQuery(queryString);
  }

  async getById(id: string) {
    const queryOptions = this.buildQueryOptions(QueryType.SELECT, { search: { id } });
    const queryString = this.queryBuilder.buildQuery(queryOptions);
    const [dbRecord] = await this.executeQuery(queryString);
    this.verifyRecordExisting(id, dbRecord);
    return dbRecord;
  }

  async update(id: string, payload: any) {
    const queryOptions = this.buildQueryOptions(QueryType.UPDATE, { search: { id }, payload });
    const queryString = this.queryBuilder.buildQuery(queryOptions);
    const [updatedRecord] = await this.executeQuery(queryString, payload);
    return updatedRecord;
  }

  async delete(id: string) {
    const payload = await this.prepareDeletionPayload(id);
    const queryOptions = this.buildQueryOptions(QueryType.DELETE, { search: { id }, payload });
    const queryString = this.queryBuilder.buildQuery(queryOptions);
    return this.executeQuery(queryString, payload);
  }

  async findOneByParams(search: IQuerySearch) {
    const [record] = await this.getList({ limit: '1' }, search);
    return record;
  }

  private executeQuery(queryString: string, payload?: any): Promise<any> {
    return this.runQueryWithArgs(queryString, payload).then(res => res.rows);
  }

  private runQueryWithArgs(queryString: string, payload: any) {
    if (payload) {
      return this.connection.query(queryString, Object.values(payload));
    }
    return this.connection.query(queryString);
  }

  private async prepareDeletionPayload(id: string) {
    const record = await this.getById(id);
    const payload = { ...record, is_deleted: true };

    if (payload.id) {
      delete payload.id;
    }

    return payload;
  }

  private verifyRecordExisting(id: string, dbRecord: any) {
    if (!dbRecord) {
      throw new HttpError(`Record with ID {${id}} in ${this.entityConfig.tableName} table, not found.`, 404);
    }
  }

  private buildQueryOptions(type: QueryType, params: IQueryRawOptions): IQueryOptions {
    return {
      table: this.entityConfig.tableName,
      excludeReturnFields: this.entityConfig.excludeReturnFields,
      type,
      ...params,
    };
  }
}
