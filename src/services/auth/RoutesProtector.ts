import { inject, injectable } from 'inversify';
import { TYPE } from '../../constants/types';
import { UserRepository } from '../../db/repository/UserRepository';
import { HttpError } from '../../errors/types/HttpError';
import { AuthenticationService } from './AuthenticationService';

const MESSAGE = {
  headerError: 'Authorization header was not provided or not valid',
};

@injectable()
export class RoutesProtector {
  constructor(
    @inject(TYPE.AuthenticationService) private authService: AuthenticationService,
    @inject(TYPE.UserRepository) private userRepository: UserRepository,
  ) {}

  async isAuthenticated(bearerToken: string | undefined) {
    const [bearer, token] = (bearerToken || '').split(' ');

    this.isDefined(bearer);
    this.isDefined(token);

    const { email }: any = await this.authService.decodeToken(token);
    this.isDefined(email);

    return this.userRepository.findOneByParams({ email });
  }

  private isDefined(value: string | undefined) {
    if (!value) {
      throw new HttpError(MESSAGE.headerError, 401);
    }
  }
}
