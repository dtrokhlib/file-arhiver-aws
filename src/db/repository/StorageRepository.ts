import { inject, injectable } from 'inversify';
import { Repository } from './Repository';
import { ENTITIES, TYPE } from '../../constants/types';
import { DatabaseConnector } from '../connector';
import { QueryBuilder } from '../utils/QueryBuilder';

@injectable()
export class StorageRepository extends Repository {
  constructor(
    @inject(TYPE.DatabaseConnector) dbConnector: DatabaseConnector,
    @inject(TYPE.QueryBuilder) queryBuilder: QueryBuilder,
    @inject(ENTITIES.Storage) tableName: string,
  ) {
    super(dbConnector, queryBuilder, { tableName });
  }
}
