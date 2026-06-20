import { existsSync } from 'node:fs';
import express from 'express';
import cors from 'cors';
import routes from './routes/index.router.ts';
import './infra/database/mongo/index.ts';

if (existsSync('.env')) process.loadEnvFile('.env');

class App {
  public server: express.Application;

  public constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  public init(): express.Application {
    return this.server;
  }

  private middlewares(): void {
    this.server.use(express.json({}));
    this.server.use(
      express.urlencoded({
        extended: true
      })
    );
    this.server.use(cors());
  }

  private routes(): void {
    this.server.use(...routes);
  }
}

export default App;
