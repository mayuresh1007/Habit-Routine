import User from '@/models/User';

describe('User Model', () => {
    it('should create a user with hashed password', async () => {
        const user = await User.create({
            name: 'Test User',
            email: 'test@example.com',
            passwordHash: 'TestPass123',
        });

        expect(user.name).toBe('Test User');
        expect(user.email).toBe('test@example.com');
        // Password should be hashed, not plain text
        expect(user.passwordHash).not.toBe('TestPass123');
        expect(user.passwordHash).toMatch(/^\$2[aby]\$/);
    });

    it('should enforce unique email', async () => {
        await User.create({
            name: 'User 1',
            email: 'same@example.com',
            passwordHash: 'TestPass123',
        });

        await expect(
            User.create({
                name: 'User 2',
                email: 'same@example.com',
                passwordHash: 'TestPass456',
            })
        ).rejects.toThrow();
    });

    it('should validate required fields', async () => {
        await expect(User.create({} as never)).rejects.toThrow();
        await expect(
            User.create({ name: 'Test' } as never)
        ).rejects.toThrow();
    });

    it('should compare passwords correctly', async () => {
        const user = await User.create({
            name: 'Test User',
            email: 'compare@example.com',
            passwordHash: 'TestPass123',
        });

        const isValid = await user.comparePassword('TestPass123');
        expect(isValid).toBe(true);

        const isInvalid = await user.comparePassword('WrongPassword');
        expect(isInvalid).toBe(false);
    });

    it('should strip passwordHash from JSON', async () => {
        const user = await User.create({
            name: 'Test User',
            email: 'json@example.com',
            passwordHash: 'TestPass123',
        });

        const json = user.toJSON();
        expect(json.passwordHash).toBeUndefined();
        expect(json.__v).toBeUndefined();
    });
});
