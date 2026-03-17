import mongoose from 'mongoose';

// Connect to the in-memory MongoDB before tests
beforeAll(async () => {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        throw new Error('MONGODB_URI not set by global setup');
    }
    await mongoose.connect(uri);
});

// Clear all collections between tests for isolation
afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
});

// Disconnect after all tests
afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
});
