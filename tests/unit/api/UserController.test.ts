import 'reflect-metadata';
import { UserController } from '../../../src/api/v1/controllers/UserController';
import { UserService } from '../../../src/services/UserService';
import { ConfigService } from '../../../src/config';

const getMockedRepository = (body?: any) =>
  ({
    create: jest.fn(data => data),
    getList: jest.fn(data => [body]),
    getById: jest.fn(data => body),
    update: jest.fn((id, data) => data),
    delete: jest.fn(data => {}),
    findOneByParams: jest.fn(data => data),
  } as any);

const createUserController = (body?: any) => {
  const repository = getMockedRepository(body);
  const configService = new ConfigService();
  const userService = new UserService(configService, repository);
  const controller = new UserController(userService);

  return { controller, repository };
};

const getDefaultEndpointParams = (body?: any) => ({
  next: jest.fn(data => data),
  req: { body, user: { id: 1 }, params: { id: '1' } } as any,
  res: {
    json: jest.fn(data => data),
    send: jest.fn(),
    status: jest.fn(),
  } as any,
});

const getDefaultPayload = () => ({
  name: 'username',
  email: 'mail@email.com',
  password: 'user-password',
  firstName: 'user-first-name',
  lastName: 'user-last-name',
});

describe('User Controller API Endpoints', () => {
  test('Create user', async () => {
    const payload = getDefaultPayload();
    const { controller } = createUserController();
    const { req, res, next } = getDefaultEndpointParams(payload);

    await controller.create(req, res, next);

    expect(res.json).toBeCalledWith(payload);
  });

  test('Create user with hashed password', async () => {
    const payload = getDefaultPayload();
    const { controller } = createUserController();
    const { req, res, next } = getDefaultEndpointParams(payload);

    await controller.create(req, res, next);

    const hashedPassword = res.json.mock.calls[0][0];
    expect(payload.password).not.toBe(hashedPassword);
  });

  test('Get user by id', async () => {
    const payload = getDefaultPayload();
    const { controller } = createUserController(payload);
    const { req, res, next } = getDefaultEndpointParams(payload);

    await controller.getById(req, res, next);

    expect(res.json).toBeCalledWith(payload);
  });

  test('Get user list', async () => {
    const payload = getDefaultPayload();
    const { controller } = createUserController(payload);
    const { req, res, next } = getDefaultEndpointParams(payload);

    await controller.list(req, res, next);

    expect(res.json).toBeCalledWith([payload]);
  });

  test('Update user', async () => {
    const payload = getDefaultPayload();
    const { controller } = createUserController();
    const { req, res, next } = getDefaultEndpointParams(payload);

    await controller.update(req, res, next);

    expect(res.json).toBeCalledWith(payload);
  });

  test('Delete user', async () => {
    const { controller } = createUserController();
    const { req, res, next } = getDefaultEndpointParams();

    await controller.delete(req, res, next);

    expect(res.status).toBeCalledWith(204);
  });
});
