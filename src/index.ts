import 'reflect-metadata';
import { InversifyExpressServer } from 'inversify-express-utils';
import express, { Application, NextFunction, Response } from 'express';
import { Container } from 'inversify';
import { buildProviderModule } from 'inversify-binding-decorators';
import morgan from 'morgan';
import { errorHandler } from './errors/ErrorHandler';
import { bindings } from './inversify.config';
import { ConfigService } from './config';
import { IRequest } from './interfaces/api/IRequest';
import { addUserToRequest } from './api/v1/middlewares/AddUserToRequest';

import './api/v1/controllers/StorageController';
import './api/v1/controllers/UserController';
import './api/v1/controllers/AuthenticationController';
import './api/v1/controllers/PermissionController';
import './api/v1/controllers/RolesController';

class Server {
  private readonly app: Application;

  private readonly container: Container;

  private readonly server: InversifyExpressServer;

  private readonly config: ConfigService;

  constructor() {
    this.config = new ConfigService();

    this.container = new Container();
    this.container.load(buildProviderModule());
    this.container.loadAsync(bindings);

    this.server = new InversifyExpressServer(this.container);
    this.server.setConfig(this.setupApplication.bind(this));

    this.app = this.server.build();

    this.setupErrorHandler();
  }

  listen() {
    const { port = 3000 } = this.config.getByKey('application');
    this.app.listen(port);
    console.log(`Server running on port: ${this.config.getByKey('application').port}`);
  }

  setupApplication(app: Application) {
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use((req: IRequest, res: Response, next: NextFunction) => {
      req.container = this.container;
      next();
    });
    app.use(morgan('[:date[clf]] :method :url :status :res[content-length] - :response-time ms'));

    app.use(addUserToRequest);
  }

  setupErrorHandler() {
    this.app.use(errorHandler);
  }

  getApplication() {
    return this.app;
  }
}

const server = new Server();
server.listen();

export const app = server.getApplication();
