import type {Config} from 'jest';

export default async (): Promise<Config> => {
    return {
        verbose: true,
        testMatch: ["**/tests/**/*-test.ts"],
        testEnvironment: "node",
        transform: {
            "^.+\\.(ts|tsx)$": "ts-jest",
        },
        setupFilesAfterEnv: ['./jest.setup.ts'],
    };
};
