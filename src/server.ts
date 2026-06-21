import mongoose from 'mongoose';
import App from './app.ts';
import connectDatabase from '#shared/infra/database/mongo/index.ts';
import logger from '#shared/logger/index.ts';

const app = new App();
const port = process.env.PORT || 3000;

connectDatabase();

const httpServer = app.init().listen(port, () => {
  logger.info('App starting', {
    url: `http://localhost:${port}`,
    env: process.env.TARGET || 'local',
  });
});

async function shutdown(signal: string): Promise<void> {
  logger.info('Shutting down', { signal });
  await new Promise<void>((resolve) => httpServer.close(() => resolve()));
  await mongoose.disconnect();
  process.exit(0);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
