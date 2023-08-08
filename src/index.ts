import 'reflect-metadata';
import { InversifyExpressServer } from 'inversify-express-utils';
import express, { Application } from 'express';
import { Container } from 'inversify';
import { buildProviderModule } from 'inversify-binding-decorators';
import { errorHandler } from './errors/ErrorHandler';
import { bindings } from './inversify.config';
import { ConfigService } from './config';

import './api/v1/controllers/StorageController';
import './api/v1/controllers/UserController';
import './api/v1/controllers/AuthenticationController';

class Server {
  private readonly app: Application;

  private readonly container: Container;

  private readonly server: InversifyExpressServer;

  private readonly config: ConfigService;

  constructor() {
    this.config = new ConfigService();

    this.container = new Container();
    this.container.load(buildProviderModule());
    this.setupMiddleware();
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
  }

  setupMiddleware() {}

  setupErrorHandler() {
    this.app.use(errorHandler);
  }
}

const server = new Server();
server.listen();
