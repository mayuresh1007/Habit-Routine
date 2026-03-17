import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/__tests__'],
    testMatch: ['**/*.test.ts'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    setupFilesAfterEnv: ['<rootDir>/__tests__/setup.ts'],
    globalSetup: '<rootDir>/__tests__/global-setup.ts',
    globalTeardown: '<rootDir>/__tests__/global-teardown.ts',
    transform: {
        '^.+\\.ts$': [
            'ts-jest',
            {
                tsconfig: 'tsconfig.json',
            },
        ],
    },
    // Don't transform node_modules
    transformIgnorePatterns: ['/node_modules/'],
    // Timeout for slow CI environments
    testTimeout: 30000,
};

export default config;
