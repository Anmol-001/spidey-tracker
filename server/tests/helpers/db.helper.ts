import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer: MongoMemoryServer | null = null;

/**
 * Connects to MongoDB Memory Server or explicit MONGODB_URI_TEST.
 * Guarantees tests never connect to the development or production database.
 */
export async function connectTestDb(): Promise<string> {
  const customTestUri = process.env['MONGODB_URI_TEST'];

  let uri: string;

  if (customTestUri) {
    uri = customTestUri;
  } else {
    mongoServer = await MongoMemoryServer.create();
    uri = mongoServer.getUri();
  }

  // If already connected, disconnect first
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
  });

  return uri;
}

/**
 * Clears all documents from all collections to ensure test isolation.
 */
export async function clearTestDb(): Promise<void> {
  if (mongoose.connection.readyState !== 1) {
    return;
  }

  const collections = mongoose.connection.collections;
  const promises: Promise<unknown>[] = [];

  for (const key of Object.keys(collections)) {
    const collection = collections[key];
    if (collection) {
      promises.push(collection.deleteMany({}));
    }
  }

  await Promise.all(promises);
}

/**
 * Gracefully disconnects Mongoose and stops the MongoDB Memory Server.
 */
export async function disconnectTestDb(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  if (mongoServer) {
    await mongoServer.stop();
    mongoServer = null;
  }
}
