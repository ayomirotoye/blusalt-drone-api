import type {Config} from 'jest';
import {createDefaultPreset} from "ts-jest";

const tsJestTransformCfg = createDefaultPreset().transform;

export default async (): Promise<Config> => {
    return {
        verbose: true,
        testMatch: ['**/tests/**/*-test.ts'],
        testEnvironment: "node",
        transform: {
            ...tsJestTransformCfg,
        },
    };
};