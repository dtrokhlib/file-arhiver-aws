import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @Length(5, 100)
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @Length(5, 100)
  @IsString()
  password: string;

  @Length(1, 100)
  @IsString()
  firstName: string;

  @Length(1, 100)
  @IsString()
  lastName: string;
}
