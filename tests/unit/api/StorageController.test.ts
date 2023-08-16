import fs from 'fs';
import 'reflect-metadata';
import { StorageController } from '../../../src/api/v1/controllers/StorageController';
import { StorageService } from '../../../src/services/StorageService';
import { ConfigService } from '../../../src/config';
import { StorageConnector } from '../../../src/connectors/StorageConnector';

const getFileMock = () => ({
  fieldname: 'fieldname',
  originalname: 'originalname.test',
  encoding: 'some',
  mimetype: 'some',
  size: 456,
  destination: 'tmp/',
  filename: 'originalname.test',
  path: 'tmp/originalname.test',
});

const getMockedRepository = (body?: any) =>
  ({
    create: jest.fn(data => data),
    getList: jest.fn(data => [body]),
    getById: jest.fn(data => body),
    update: jest.fn((id, data) => data),
    delete: jest.fn(data => {}),
    findOneByParams: jest.fn(data => data),
  } as any);

const createStorageController = (body?: any) => {
  const storageRepository = getMockedRepository(body);
  const userRepository = getMockedRepository();
  const configService = new ConfigService();

  const storageConnector = new StorageConnector(configService);
  fs.createReadStream = jest.fn();
  jest.spyOn(storageConnector, 'executeCommand').mockImplementation();

  const storageService = new StorageService(storageConnector, storageRepository, userRepository);
  const controller = new StorageController(storageService);

  return { controller, storageService, userRepository, storageRepository };
};

const getDefaultEndpointParams = (body?: any) => ({
  next: jest.fn(data => data),
  req: { body, user: { id: 1 }, params: { id: '1' }, file: getFileMock() } as any,
  res: {
    json: jest.fn(data => data),
    send: jest.fn(),
    status: jest.fn(),
  } as any,
});

describe('Storage Controller API Endpoints', () => {
  test('Upload file', async () => {
    const { controller, storageService } = createStorageController();
    const { req, res, next } = getDefaultEndpointParams();

    const spy = jest.spyOn(storageService, 'uploadFile');
    await controller.create(req, res, next);

    console.log(res.json.mock.calls);
  });

  test('Get file by id', async () => {
    const { controller, storageService } = createStorageController();
    const { req, res, next } = getDefaultEndpointParams();

    const spy = jest.spyOn(storageService as any, 'isRecordOwner');
    await controller.getById(req, res, next);

    console.log(spy.mock.calls);
  });

  test('Get file list', async () => {
    const { controller } = createStorageController();
    const { req, res, next } = getDefaultEndpointParams();

    await controller.list(req, res, next);

    expect(res.json).toBeCalledWith();
  });

  test('Update file', async () => {
    const { controller } = createStorageController();
    const { req, res, next } = getDefaultEndpointParams();

    await controller.update(req, res, next);

    expect(res.json).toBeCalledWith();
  });

  test('Delete file', async () => {
    const { controller } = createStorageController();
    const { req, res, next } = getDefaultEndpointParams();

    await controller.delete(req, res, next);

    expect(res.status).toBeCalledWith(204);
  });
});
