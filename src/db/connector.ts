import { injectable } from 'inversify';
import { Pool, PoolConfig } from 'pg';

@injectable()
export class DatabaseConnector {
  private readonly connection: Pool;

  constructor(@inject(TYPE.ConfigService) config: PoolConfig) {
    this.connection = new Pool({ ...config });
  }

  public getConnection() {
    return this.connection;
  }
}
