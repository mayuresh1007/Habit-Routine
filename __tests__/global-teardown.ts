import { MongoMemoryServer } from 'mongodb-memory-server';

// Global teardown: stop the in-memory MongoDB instance
export default async function globalTeardown() {
    const mongod = (globalThis as Record<string, unknown>)
        .__MONGOD__ as MongoMemoryServer;
    if (mongod) {
        await mongod.stop();
    }
}
