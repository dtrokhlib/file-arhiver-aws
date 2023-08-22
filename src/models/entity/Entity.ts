import { plainToClass } from 'class-transformer';
import { v4 as uuidv4 } from 'uuid';
import { validate } from 'class-validator';
import { UploadFileDto } from '../UploadFileDto';
import { ValidationError } from '../../errors/types/ValidationError';

export class FileEntity {
  id: number;

  sid: string;

  name: string;

  filename: string;

  extension: string;

  is_deleted: boolean;

  user_id: string;

  constructor(data: any) {
    this.id = data.id;
    this.sid = data.sid || uuidv4();
    this.name = data.name;
    this.filename = data.filename;
    this.extension = data.extension;
    this.is_deleted = data.is_deleted || false;
    this.user_id = data.user_id;
  }

  static async validatePayload(data: any) {
    const user = plainToClass(UploadFileDto, data);
    const errors = await validate(user);

    if (errors.length) {
      throw new ValidationError(errors.toString());
    }
  }

  // validateUpdatePayload() {
  // }
}
