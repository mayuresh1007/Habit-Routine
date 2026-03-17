import User from '@/models/User';
import { IUser } from '@/models/User';

interface TestUser {
    user: IUser;
    password: string;
}

/**
 * Create a test user in the database
 */
export async function createTestUser(
    overrides: Partial<{ name: string; email: string; password: string }> = {}
): Promise<TestUser> {
    const password = overrides.password || 'TestPass123';
    const user = await User.create({
        name: overrides.name || 'Test User',
        email: overrides.email || 'test@example.com',
        passwordHash: password,
    });

    return { user, password };
}

/**
 * Create multiple test users
 */
export async function createTestUsers(count: number): Promise<TestUser[]> {
    const users: TestUser[] = [];
    for (let i = 0; i < count; i++) {
        const testUser = await createTestUser({
            name: `User ${i + 1}`,
            email: `user${i + 1}@example.com`,
        });
        users.push(testUser);
    }
    return users;
}
