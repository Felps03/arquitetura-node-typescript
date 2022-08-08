import mongoose from 'mongoose';

class Database {
  constructor() {
    this.connect();
  }

  connect() {
    return mongoose.connect(
      process.env.MONGO_DB_URL || 'mongodb://localhost:27017/bolsista'
    );
  }
}

export default new Database().connect();
