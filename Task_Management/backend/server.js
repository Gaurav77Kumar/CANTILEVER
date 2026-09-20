import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import app from './app.js';

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error('Set JWT_SECRET to a random secret of at least 32 characters in backend/.env.');
  process.exit(1);
}
await connectDB();
const server = app.listen(process.env.PORT || 5000, () => console.log('API ready on port ' + (process.env.PORT || 5000)));
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.close(async () => {
    await mongoose.disconnect();
    process.exit(0);
  }));
}
