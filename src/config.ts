import { injectable } from 'inversify';

@injectable()
export class ConfigService {
  private config: any = {
    application: {
      port: 3000,
    },
    db: {
      postgres: {
        user: 'postgres',
        password: 'mysecretpassword',
        host: 'localhost',
        port: 5432,
        database: 'file_archiver',
        max: 10,
        idleTimeoutMillis: 10000,
        connectionTimeoutMillis: 2000,
      },
    },
  };

  public getByKey(key: string) {
    return this.config[key] || {};
  }
}
