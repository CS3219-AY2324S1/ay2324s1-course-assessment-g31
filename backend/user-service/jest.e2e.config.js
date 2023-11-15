/** @type {import('ts-jest').JestConfigWithTsJest} */
/* eslint-env node */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/tests/e2e/**/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/util/prisma/singleton.ts'],
};