const base = require('./jest.base.cjs');

/** @type {import('jest').Config} */
module.exports = {
  ...base,
  rootDir: __dirname,
  displayName: 'integration',
  testMatch: ['**/src/tests/int/**/*.test.ts'],
  moduleNameMapper: {
    '^@/(?:lib/)?prismaClient(?:\\.(?:js|ts))?$':
      '<rootDir>/src/tests/_helper/prisma-mock.ts',
    '^.+/(?:lib/)?prismaClient(?:\\.(?:js|ts))?$':
      '<rootDir>/src/tests/_helper/prisma-mock.ts',

    '^@/(.*)$': '<rootDir>/src/$1',

    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  setupFiles: ['<rootDir>/src/tests/_helper/jest.env.setup.ts'],
};
