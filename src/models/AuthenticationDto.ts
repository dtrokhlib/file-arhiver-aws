import { IsEmail, IsString, Length } from 'class-validator';

export class AuthenticationDto {
  @IsEmail()
  email: string;

  @Length(5, 100)
  @IsString()
  password: string;
}
