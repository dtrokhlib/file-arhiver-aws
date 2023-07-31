import { AsyncContainerModule } from 'inversify';
import TYPE from './constants/types';
import { DatabaseConnector } from './db/connector';
import { UserRepository } from './db/repository/UserRepositroy';
import { ConfigService } from './config';

export const bindings = new AsyncContainerModule(async bind => {
  bind<DatabaseConnector>(TYPE.DatabaseConnector).to(DatabaseConnector).inSingletonScope();
  bind<UserRepository>(TYPE.UserRepository).to(UserRepository);
  bind<ConfigService>(TYPE.ConfigService).to(ConfigService);
});
