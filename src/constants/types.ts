export const TYPE = {
  DatabaseConnector: Symbol.for('DatabaseConnector'),
  StorageConnector: Symbol.for('StorageConnector'),
  UserRepository: Symbol.for('UserRepository'),
  StorageRepository: Symbol.for('StorageRepository'),
  ConfigService: Symbol.for('ConfigService'),
  StorageService: Symbol.for('StorageService'),
  QueryBuilder: Symbol.for('QueryBuilder'),
  AuthenticationService: Symbol.for('AuthenticationService'),
};

export const ENTITIES = {
  User: Symbol.for('User'),
  Storage: Symbol.for('Storage'),
};
