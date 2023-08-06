import { PutObjectCommand, GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import fs from 'fs';
import path from 'path';
import { inject, injectable } from 'inversify';
import { TYPE } from '../constants/types';
import { ConfigService } from '../config';
import { HttpError } from '../errors/types/HttpError';

const OneHour = 3600;

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
    const fileExtension = this.getFileExtension(pathToFile);
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: `${sid}.${fileExtension}`,
      Body: fs.createReadStream(pathToFile),
    });

    return this.executeCommand('putFileToBucket', command);
  }

  async getSignedUrl(sid: string) {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: sid,
    });
    const url = await getSignedUrl(this.s3Client as any, command as any, { expiresIn: OneHour });
    return url;
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
