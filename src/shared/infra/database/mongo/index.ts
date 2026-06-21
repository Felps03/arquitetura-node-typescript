import mongoose from 'mongoose';
import logger from '#shared/logger/index.ts';

export default function connectDatabase() {
  return mongoose
    .connect(process.env.MONGO_DB_URL || 'mongodb://localhost:27017/arquitetura-node-typescript')
    .catch((error) => logger.error('MongoDB connection error', { message: error.message }));
}
