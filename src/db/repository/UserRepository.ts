import { inject, injectable } from 'inversify';
import { Repository } from './Repository';
import { ENTITIES, EXCLUDED_FIELDS, TYPE } from '../../constants/types';
import { DatabaseConnector } from '../connector';
import { QueryBuilder } from '../utils/QueryBuilder';

@injectable()
export class UserRepository extends Repository {
  constructor(
    @inject(TYPE.DatabaseConnector) dbConnector: DatabaseConnector,
    @inject(TYPE.QueryBuilder) queryBuilder: QueryBuilder,
    @inject(ENTITIES.User) tableName: string,
    @inject(EXCLUDED_FIELDS.User) excludeReturnFields: string[],
  ) {
    super(dbConnector, queryBuilder, { tableName, excludeReturnFields });
  }
}
