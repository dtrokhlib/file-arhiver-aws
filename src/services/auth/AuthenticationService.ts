import { inject, injectable } from 'inversify';
import { compare } from 'bcrypt';
import { TYPE } from '../../constants/types';
import { ConfigService } from '../../config';
import { asyncSign, asyncVerify } from '../../utils/PromisifiedJwt';
import { AuthenticationDto } from '../../models/AuthenticationDto';
import { UserRepository } from '../../db/repository/UserRepository';
import { HttpError } from '../../errors/types/HttpError';

@injectable()
export class AuthenticationService {
  private readonly authConfig: any;

  constructor(
    @inject(TYPE.ConfigService) config: ConfigService,
    @inject(TYPE.UserRepository) private userRepository: UserRepository,
  ) {
    this.authConfig = config.getByKey('auth');
  }

  async authenticate(user: AuthenticationDto) {
    await this.verifyUser(user);
    return this.signToken({ email: user.email });
  }

  private async signToken(payload: any) {
    const { secret, expiresIn } = this.authConfig.jwt;
    const token = asyncSign(payload, secret, { expiresIn });
    return token;
  }

  async decodeToken(token: string) {
    const { secret } = this.authConfig.jwt;
    const decodedPayload = await asyncVerify(token, secret);
    return decodedPayload;
  }

  private async verifyUser({ email, password }: AuthenticationDto) {
    const existingUser = await this.userRepository.findOneByParams({ email });
    this.verifyPositiveCase(existingUser);

    const isValidPassword = await compare(password, existingUser.password);
    this.verifyPositiveCase(isValidPassword);
  }

  private verifyPositiveCase(result: any) {
    if (!result) {
      throw new HttpError('Credentials not valid', 403);
    }
  }
}
