export class CreateUserDto {
  name: string;

  email: string;

  password: string;

  firstName: string;

  lastName: string;

  is_deleted: boolean;

  constructor(data: any) {
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.is_deleted = data.is_deleted || false;
  }
}
