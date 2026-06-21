import { existsSync } from 'node:fs';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import routes from '#routes/index.router.ts';
import errorHandler from '#shared/middlewares/errorHandler.ts';
import requestLogger from '#shared/middlewares/requestLogger.ts';
import generateOpenApiDocument from './docs/openapi.ts';

if (existsSync('.env')) process.loadEnvFile('.env');

class App {
  public server: express.Application;

  public constructor() {
    this.server = express();
    this.middlewares();
    this.health();
    this.routes();
    this.docs();
    this.errorHandler();
  }

  public init(): express.Application {
    return this.server;
  }

  private middlewares(): void {
    this.server.use(requestLogger);
    this.server.use(express.json({}));
    this.server.use(
      express.urlencoded({
        extended: true,
      }),
    );
    this.server.use(cors());
  }

  private health(): void {
    this.server.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));
  }

  private routes(): void {
    this.server.use(...routes);
  }

  private docs(): void {
    const document = generateOpenApiDocument();
    this.server.get('/docs/openapi.json', (_req, res) => res.json(document));
    this.server.use('/docs', swaggerUi.serve, swaggerUi.setup(document));
  }

  private errorHandler(): void {
    this.server.use(errorHandler);
  }
}

export default App;
