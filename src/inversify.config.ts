import { AsyncContainerModule } from 'inversify';
import { ENTITIES, TYPE } from './constants/types';
import { DatabaseConnector } from './db/connector';
import { UserRepository } from './db/repository/UserRepository';
import { ConfigService } from './config';
import { QueryBuilder } from './db/utils/QueryBuilder';

export const bindings = new AsyncContainerModule(async bind => {
  bind<DatabaseConnector>(TYPE.DatabaseConnector).to(DatabaseConnector).inSingletonScope();
  bind<UserRepository>(TYPE.UserRepository).to(UserRepository);
  bind<ConfigService>(TYPE.ConfigService).to(ConfigService);
  bind<QueryBuilder>(TYPE.QueryBuilder).to(QueryBuilder);

  bind<string>(ENTITIES.User).toConstantValue('users');
});
