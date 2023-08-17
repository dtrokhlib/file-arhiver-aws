import { PutObjectCommand, GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createReadStream } from 'fs';
import path from 'path';
import { inject, injectable } from 'inversify';
import { TYPE } from '../constants/types';
import { ConfigService } from '../config';
import { HttpError } from '../errors/types/HttpError';
import { OneHourInMilliseconds } from '../constants/time';

@injectable()
export class StorageConnector {
  private awsConfig: any;

  private bucket: string;

  private s3Client: S3Client;

  constructor(@inject(TYPE.ConfigService) private configService: ConfigService) {
    this.awsConfig = this.configService.getByKey('aws');
    this.assignBucket();
    this.assignS3Client();
  }

  async uploadFile(sid: string, pathToFile: string) {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: `${sid}.${this.getFileExtension(pathToFile)}`,
      Body: createReadStream(pathToFile),
    });

    return this.executeCommand('putFileToBucket', command);
  }

  getSignedUrl(sid: string, filename: string) {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: `${sid}.${this.getFileExtension(filename)}`,
    });
    return getSignedUrl(this.s3Client as any, command as any, { expiresIn: OneHourInMilliseconds });
  }

  // async getFileFromBucket() {}

  // async updateFileInBucket() {}

  async executeCommand(commandName: string, command: any) {
    try {
      console.log(`${commandName} command started: `, command);
      const response = await this.s3Client.send(command);
      console.log(`${commandName} command finished: `, response);
      return response;
    } catch (error) {
      const errorMessage = `${commandName} command error: ${error}`;
      console.error(errorMessage);
      throw new HttpError(errorMessage, 503);
    }
  }

  private getFileExtension(filename: string) {
    return path.extname(filename).slice(1);
  }

  private assignBucket() {
    this.bucket = this.awsConfig.s3?.bucket;
  }

  private assignS3Client() {
    const region = this.awsConfig.region || 'eu-central-1';
    const credentials = this.awsConfig.credentials || {};

    this.s3Client = new S3Client({ region, credentials });
  }
}
