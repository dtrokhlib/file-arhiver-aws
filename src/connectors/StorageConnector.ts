import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

export class Storage {
  constructor(private readonly bucketname: string, private readonly s3: S3Client) {}

  async putFileToBucket(pathToFile: string) {
    const fileExtension = this.getFileExtension(pathToFile);
    const command = new PutObjectCommand({
      Bucket: this.bucketname,
      Key: `${uuidv4()}.${fileExtension}`,
      Body: fs.createReadStream(pathToFile),
    });

    return this.executeCommand('putFileToBucket', command);
  }

  async getFileFromBucket() {}

  async updateFileInBucket() {}

  async executeCommand(commandName: string, command: any) {
    try {
      const response = await this.s3.send(command);
      console.log(`${commandName} command finished: `, response);
    } catch (error) {
      console.error(`${commandName} command error: `, error);
    }
  }

  getFileExtension(filename: string) {
    return path.extname(filename).slice(1);
  }
}
