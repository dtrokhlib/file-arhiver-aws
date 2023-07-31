import { IsNumber, IsString, Length } from 'class-validator';

export class UploadFileDto {
  @Length(5, 100)
  @IsString()
  name: string;

  @Length(5, 100)
  @IsString()
  filename: string;

  @Length(1, 10)
  @IsString()
  extension: string;

  @IsNumber()
  userId: string;
}
