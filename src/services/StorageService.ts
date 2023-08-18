import { inject, injectable } from 'inversify';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import { TYPE } from '../constants/types';
import { StorageConnector } from '../connectors/StorageConnector';
import { IFile } from '../interfaces/api/IFile';
import { StorageRepository } from '../db/repository/StorageRepository';
import { HttpError } from '../errors/types/HttpError';
import { IQueryFilters, IQuerySearch } from '../interfaces/api/IQuery';
import { BaseService } from './BaseService';
import { UserRepository } from '../db/repository/UserRepository';

@injectable()
export class StorageService extends BaseService {
  constructor(
    @inject(TYPE.StorageConnector) private connector: StorageConnector,
    @inject(TYPE.StorageRepository) private storageRepository: StorageRepository,
    @inject(TYPE.UserRepository) private userRepository: UserRepository,
  ) {
    super();
  }

  getList(filters: IQueryFilters, search: IQuerySearch) {
    return this.storageRepository.getList(filters, search);
  }

  async getById(id: string) {
    const file = await this.storageRepository.getById(id);
    this.isRecordOwner(id, file);

    return file;
  }

  delete(id: string) {
    return this.storageRepository.delete(id);
  }

  async uploadFile(userId: string, file: IFile) {
    try {
      const payload = this.preparePayloadForFile(userId, file);
      await this.verifyFileUploader(payload.userId);
      const createdFile = await this.storageRepository.create(payload);
      await this.connector.uploadFile(payload.sid, file.path);
      return createdFile;
    } finally {
      await fs.unlink(file.path).catch(this.unlinkErrorHandler);
    }
  }

  async updateFile(fileId: string, userId: string, file: IFile) {
    try {
      const payload = this.preparePayloadForFile(userId, file);
      const createdFile = await this.storageRepository.update(fileId, payload);
      await this.connector.uploadFile(payload.sid, file.path);
      return createdFile;
    } finally {
      await fs.unlink(file.path).catch(this.unlinkErrorHandler);
    }
  }

  async getSignedUrl(userId: string, fileId: string) {
    const file = await this.storageRepository.findOneByParams({ userid: userId, id: fileId });
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

  async verifyFileUploader(userId: string) {
    const isExist = await this.userRepository.getById(userId);
    if (!isExist) {
      throw new HttpError('Not existing user specified', 400);
    }
  }

  unlinkErrorHandler(err: any) {
    if (err?.code !== 'ENOENT') {
      console.error(err);
    }
  }
}
