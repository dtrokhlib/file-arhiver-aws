import 'reflect-metadata';
import { InversifyExpressServer } from 'inversify-express-utils';
// import { S3Client } from '@aws-sdk/client-s3';
import express, { Application } from 'express';
// import { Storage } from './connectors/StorageConnector';
import { Container } from 'inversify';
import { buildProviderModule } from 'inversify-binding-decorators';
import { Config } from './config';

import './api/v1/controllers/StorageController';
import './api/v1/controllers/UserController';
import { errorHandler } from './errors/ErrorHandler';
import { bindings } from './inversify.config';

// const s3Client = new S3Client(Config.awsCredentials);
// const storage = new Storage(Config.s3.bucket, s3Client);

class Server {
  private readonly app: Application;

  private readonly container: Container;

  private readonly server: InversifyExpressServer;

  constructor() {
    this.container = new Container();
    this.container.load(buildProviderModule());
    this.setupMiddleware();
    this.container.loadAsync(bindings);

    this.server = new InversifyExpressServer(this.container);
    this.server.setConfig(this.setupApplication.bind(this));

    this.app = this.server.build();

    this.setupErrorHandler();
  }

  listen(port: number) {
    this.app.listen(port);
    console.log(`Server running on port: ${Config.application.port}`);
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
server.listen(Config.application.port);
