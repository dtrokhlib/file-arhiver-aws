import { inject, injectable } from 'inversify';
import { Repository } from './Repository';
import { ENTITIES, TYPE } from '../../constants/types';
import { DatabaseConnector } from '../connector';
import { QueryBuilder } from '../utils/QueryBuilder';
import { QueryType } from '../../interfaces/db/QueryType';
import { JoinType } from '../../interfaces/db/QueryOptions';

@injectable()
export class RolesPermissionRepository extends Repository {
  constructor(
    @inject(TYPE.DatabaseConnector) dbConnector: DatabaseConnector,
    @inject(TYPE.QueryBuilder) queryBuilder: QueryBuilder,
    @inject(ENTITIES.RolesPermission) tableName: string,
    @inject(ENTITIES.Permission) private permissionTable: string,
  ) {
    super(dbConnector, queryBuilder, { tableName });
  }

  async getPermission(id: string) {
    const queryOptions = this.buildQueryOptions(QueryType.SELECT, { search: { id } });

    queryOptions.join = {
      type: JoinType.INNER,
      tableToJoin: this.permissionTable,
      joinField: 'id',
      originField: 'permissions_id',
    };

    const queryString = this.queryBuilder.buildQuery(queryOptions);
    const [dbRecord] = await this.executeQuery(queryString);
    this.verifyRecordExisting(id, dbRecord);
    return dbRecord?.list || [];
  }
}
