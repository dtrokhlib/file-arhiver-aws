export const TYPE = {
  DatabaseConnector: Symbol.for('DatabaseConnector'),
  StorageConnector: Symbol.for('StorageConnector'),
  UserRepository: Symbol.for('UserRepository'),
  StorageRepository: Symbol.for('StorageRepository'),
  RoleRepository: Symbol.for('RoleRepository'),
  ConfigService: Symbol.for('ConfigService'),
  StorageService: Symbol.for('StorageService'),
  UserService: Symbol.for('UserService'),
  RolesService: Symbol.for('RolesService'),
  QueryBuilder: Symbol.for('QueryBuilder'),
  AuthenticationService: Symbol.for('AuthenticationService'),
  RoutesProtector: Symbol.for('RoutesProtector'),
};

export const ENTITIES = {
  User: Symbol.for('User'),
  Storage: Symbol.for('Storage'),
  Role: Symbol.for('Role'),
};

export const EXCLUDED_FIELDS = {
  User: Symbol.for('UserExcludedFields'),
};
