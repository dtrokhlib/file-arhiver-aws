export class ConfigService {
  public config: any = {
    db: {
      postgres: {
        user: 'postgress',
        password: 'mysecretpassword',
        host: 'localhost',
        port: 5432,
        max: 10,
        idleTimeoutMillis: 10000,
        connectionTimeoutMillis: 2000,
      },
    },
  };
}