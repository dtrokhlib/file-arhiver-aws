import 'reflect-metadata';
import { UserController } from '../../../src/api/v1/controllers/UserController';
import { UserService } from '../../../src/services/UserService';
import { ConfigService } from '../../../src/config';

const createUserController = () => {
  const configService = new ConfigService();
  const repository: any = {
    create: jest.fn(data => data),
    getList: jest.fn(data => data),
    getById: jest.fn(id => id),
    update: jest.fn(data => data),
    delete: jest.fn(id => id),
    findOneByParams: jest.fn(data => data),
  };
  const userService = new UserService(configService, repository);
  const controller = new UserController(userService);

  return { controller, repository };
};

const getDefaultEndpointParams = (body?: any) => {
  const req: any = body ? { body } : {};
  const res: any = {
    json: jest.fn(data => data),
  };
  const next: any = jest.fn(data => data);

  return { req, res, next };
};

describe('User Controller API Endpoints', () => {
  test('Create user', async () => {
    const payload = {
      name: 'create_user-name',
      email: 'create_user-mail@email.com',
      password: 'create_user-password',
      firstName: 'create_user-first-name',
      lastName: 'create_user-last-name',
    };

    const { controller } = createUserController();
    const { req, res, next } = getDefaultEndpointParams(payload);

    await controller.create(req, res, next);
    expect(res.json).toBeCalledWith({ ...payload });
  });
});
