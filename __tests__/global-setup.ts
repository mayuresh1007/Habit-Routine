import { MongoMemoryServer } from 'mongodb-memory-server';

// Global setup: start an in-memory MongoDB instance
export default async function globalSetup() {
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    // Store the URI and instance for global teardown
    (globalThis as Record<string, unknown>).__MONGOD__ = mongod;
    process.env.MONGODB_URI = uri;
}
