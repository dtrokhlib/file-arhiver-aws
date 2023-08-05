import { AsyncContainerModule } from 'inversify';
import { ENTITIES, TYPE } from './constants/types';
import { DatabaseConnector } from './db/connector';
import { UserRepository } from './db/repository/UserRepository';
import { ConfigService } from './config';
import { QueryBuilder } from './db/utils/QueryBuilder';
import { StorageConnector } from './connectors/StorageConnector';
import { StorageService } from './services/StorageService';

export const bindings = new AsyncContainerModule(async bind => {
  bind<DatabaseConnector>(TYPE.DatabaseConnector).to(DatabaseConnector).inSingletonScope();
  bind<StorageConnector>(TYPE.StorageConnector).to(StorageConnector);

  bind<ConfigService>(TYPE.ConfigService).to(ConfigService);
  bind<StorageService>(TYPE.StorageService).to(StorageService);

  bind<UserRepository>(TYPE.UserRepository).to(UserRepository);

  bind<QueryBuilder>(TYPE.QueryBuilder).to(QueryBuilder);

  bind<string>(ENTITIES.User).toConstantValue('users');
});
