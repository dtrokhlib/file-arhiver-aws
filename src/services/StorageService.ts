import { inject, injectable } from 'inversify';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import { TYPE } from '../constants/types';
import { StorageConnector } from '../connectors/StorageConnector';
import { IFile } from '../interfaces/api/IFile';
import { StorageRepository } from '../db/repository/StorageRepository';
import { HttpError } from '../errors/types/HttpError';

@injectable()
export class StorageService {
  constructor(
    @inject(TYPE.StorageConnector) private connector: StorageConnector,
    @inject(TYPE.StorageRepository) private repository: StorageRepository,
  ) {}

  async uploadFile(userId: string, file: IFile) {
    try {
      const payload = this.preparePayloadForFile(userId, file);
      const createdFile = await this.repository.create(payload);
      await this.connector.uploadFile(payload.sid, file.path);
      return createdFile;
    } finally {
      await fs.unlink(file.path);
    }
  }

  async updateFile(fileId: string, userId: string, file: IFile) {
    try {
      const payload = this.preparePayloadForFile(userId, file);
      const createdFile = await this.repository.update(fileId, payload);
      await this.connector.uploadFile(payload.sid, file.path);
      return createdFile;
    } finally {
      await fs.unlink(file.path);
    }
  }

  async getSignedUrl(userId: string, fileId: string) {
    const file = await this.repository.findOneByParams({ userid: userId, id: fileId });
    if (!file) {
      throw new HttpError('File not found', 404);
    }

    const signedUrl = await this.connector.getSignedUrl(file.sid, file.filename);
    return { sid: file.sid, signedUrl };
  }

  private preparePayloadForFile(userId: string, file: IFile) {
    return {
      sid: uuidv4(),
      name: file.originalname,
      filename: file.filename,
      extension: file.mimetype,
      userId,
    };
  }
}
