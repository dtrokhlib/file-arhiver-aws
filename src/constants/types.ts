export const TYPE = {
  DatabaseConnector: Symbol.for('DatabaseConnector'),
  StorageConnector: Symbol.for('StorageConnector'),
  UserRepository: Symbol.for('UserRepository'),
  StorageRepository: Symbol.for('StorageRepository'),
  RoleRepository: Symbol.for('RoleRepository'),
  PermissionRepository: Symbol.for('PermissionRepository'),
  RolesPermissionRepository: Symbol.for('RolesPermissionRepository'),
  ConfigService: Symbol.for('ConfigService'),
  StorageService: Symbol.for('StorageService'),
  UserService: Symbol.for('UserService'),
  RolesService: Symbol.for('RolesService'),
  PermissionService: Symbol.for('PermissionService'),
  QueryBuilder: Symbol.for('QueryBuilder'),
  AuthenticationService: Symbol.for('AuthenticationService'),
  AuthMiddlewares: Symbol.for('AuthMiddlewares'),
};

export const ENTITIES = {
  User: Symbol.for('User'),
  Storage: Symbol.for('Storage'),
  Role: Symbol.for('Role'),
  Permission: Symbol.for('Permission'),
  RolesPermission: Symbol.for('RolesPermission'),
};

export const EXCLUDED_FIELDS = {
  User: Symbol.for('UserExcludedFields'),
};
