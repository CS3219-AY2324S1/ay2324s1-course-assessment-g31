/** @type {import('ts-jest').JestConfigWithTsJest} */
/* eslint-env node */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/util/prisma/singleton.ts'],
};