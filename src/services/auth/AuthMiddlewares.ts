import { inject, injectable } from 'inversify';
import { TYPE } from '../../constants/types';
import { UserRepository } from '../../db/repository/UserRepository';
import { AuthenticationService } from './AuthenticationService';

@injectable()
export class AuthMiddlewares {
  constructor(
    @inject(TYPE.AuthenticationService) private authService: AuthenticationService,
    @inject(TYPE.UserRepository) private userRepository: UserRepository,
  ) {}

  async getUserByToken(bearerToken: string | undefined) {
    const token = (bearerToken || '').split(' ')[1];
    const { email }: any = await this.authService.decodeToken(token).catch(null);

    if (!email) {
      return null;
    }

    return this.userRepository.findOneByParams({ email });
  }
}
