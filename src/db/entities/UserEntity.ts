import { CreateUserDto } from '../../models/CreateUserDto';

export class UserEntity {
  constructor(private user: CreateUserDto) {}

  getReturningKeys() {
    const copiedUser: any = { ...this.user };
    if (copiedUser.password) {
      delete copiedUser.password;
    }
    return Object.keys(copiedUser);
  }
}
