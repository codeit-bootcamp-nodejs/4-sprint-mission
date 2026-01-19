const base = require('./jest.base.cjs');

/** @type {import('jest').Config} */
module.exports = {
  ...base,
  rootDir: __dirname,
  displayName: 'integration',
  testMatch: ['**/tests/int/**/*.test.ts'],
  moduleNameMapper: {
    '^@/(?:lib/)?prismaClient(?:\\.(?:js|ts))?$':
      '<rootDir>/tests/_helper/prisma-mock.ts',
    '^.+/(?:lib/)?prismaClient(?:\\.(?:js|ts))?$':
      '<rootDir>/tests/_helper/prisma-mock.ts',

    '^@/(.*)$': '<rootDir>/$1',

    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  setupFiles: ['<rootDir>/tests/_helper/jest.env.setup.ts'],
};
