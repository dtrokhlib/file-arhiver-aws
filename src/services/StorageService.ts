import { inject, injectable } from 'inversify';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import { TYPE } from '../constants/types';
import { StorageConnector } from '../connectors/StorageConnector';
import { IFile } from '../interfaces/api/IFile';
import { StorageRepository } from '../db/repository/StorageRepository';

@injectable()
export class StorageService {
  constructor(
    @inject(TYPE.StorageConnector) private connector: StorageConnector,
    @inject(TYPE.StorageRepository) private repository: StorageRepository,
  ) {}

  async uploadFileToBucket({ path }: IFile) {
    try {
      const sid = uuidv4();
      await this.connector.putFileToBucket(sid, path);
      const file = await this.repository.create({ sid });
      return file;
    } finally {
      await fs.unlink(path);
    }
  }
}
