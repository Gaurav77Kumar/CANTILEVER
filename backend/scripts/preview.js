// Isolated, disposable database for UI verification. Never uses your configured database.
import { randomBytes } from 'node:crypto';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import app from '../app.js';

process.env.JWT_SECRET = randomBytes(48).toString('hex');
const database = await MongoMemoryServer.create();
await mongoose.connect(database.getUri());
const server = app.listen(5000, '127.0.0.1', () => console.log('Disposable preview API ready on port 5000. Data is NOT persistent.'));
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.close(async () => {
    await mongoose.disconnect();
    await database.stop();
    process.exit(0);
  }));
}
