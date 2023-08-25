import { AsyncContainerModule } from 'inversify';
import { ENTITIES, EXCLUDED_FIELDS, TYPE } from './constants/types';
import { DatabaseConnector } from './db/connector';
import { UserRepository } from './db/repository/UserRepository';
import { ConfigService } from './config';
import { QueryBuilder } from './db/utils/QueryBuilder';
import { StorageConnector } from './connectors/StorageConnector';
import { StorageService } from './services/StorageService';
import { StorageRepository } from './db/repository/StorageRepository';
import { AuthenticationService } from './services/auth/AuthenticationService';
import { AuthMiddlewares } from './services/auth/AuthMiddlewares';
import { UserService } from './services/UserService';
import { RolesRepository } from './db/repository/RolesRepository';
import { PermissionRepository } from './db/repository/PermissionRepository';
import { RolesPermissionRepository } from './db/repository/RolesPermissionRepository';
import { PermissionService } from './services/PermissionService';
import { RolesService } from './services/RolesService';

export const bindings = new AsyncContainerModule(async bind => {
  bind<DatabaseConnector>(TYPE.DatabaseConnector).to(DatabaseConnector).inSingletonScope();
  bind<StorageConnector>(TYPE.StorageConnector).to(StorageConnector);

  bind<ConfigService>(TYPE.ConfigService).to(ConfigService);
  bind<UserService>(TYPE.UserService).to(UserService);
  bind<StorageService>(TYPE.StorageService).to(StorageService);
  bind<AuthenticationService>(TYPE.AuthenticationService).to(AuthenticationService);
  bind<PermissionService>(TYPE.PermissionService).to(PermissionService);
  bind<RolesService>(TYPE.RolesService).to(RolesService);

  bind<AuthMiddlewares>(TYPE.AuthMiddlewares).to(AuthMiddlewares);

  bind<UserRepository>(TYPE.UserRepository).to(UserRepository);
  bind<StorageRepository>(TYPE.StorageRepository).to(StorageRepository);
  bind<RolesRepository>(TYPE.RoleRepository).to(RolesRepository);
  bind<PermissionRepository>(TYPE.PermissionRepository).to(PermissionRepository);
  bind<RolesPermissionRepository>(TYPE.RolesPermissionRepository).to(RolesPermissionRepository);

  bind<QueryBuilder>(TYPE.QueryBuilder).to(QueryBuilder);

  bind<string>(ENTITIES.User).toConstantValue('users');
  bind<string>(ENTITIES.Storage).toConstantValue('files');
  bind<string>(ENTITIES.Role).toConstantValue('roles');
  bind<string>(ENTITIES.Permission).toConstantValue('permissions');
  bind<string>(ENTITIES.RolesPermission).toConstantValue('roles_permissions');

  bind<string[]>(EXCLUDED_FIELDS.User).toConstantValue([]);
});
