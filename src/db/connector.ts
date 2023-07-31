import { inject, injectable } from 'inversify';
import { Pool } from 'pg';
import TYPE from '../constants/types';
import { ConfigService } from '../config';

@injectable()
export class DatabaseConnector {
  private readonly connection: Pool;

  constructor(@inject(TYPE.ConfigService) configService: ConfigService) {
    const config = configService.getByKey('db').postgres;
    this.connection = new Pool(config);
  }

  public getConnection() {
    return this.connection;
  }
}
