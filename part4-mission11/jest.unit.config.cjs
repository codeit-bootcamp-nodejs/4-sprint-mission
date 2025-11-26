const base = require('./jest.base.cjs');

/** @type {import('jest').Config} */
module.exports = {
  ...base,
  rootDir: __dirname,
  displayName: 'unit',
  testMatch: ['**/tests/unit/**/*.test.ts'],
  moduleNameMapper: {
    // 1) token 모듈: 상대경로/alias 모두 커버
    '^@/lib/token(?:\\.(?:js|ts))?$': '<rootDir>/tests/_helper/token-mock.ts',
    '^.+/lib/token(?:\\.(?:js|ts))?$': '<rootDir>/tests/_helper/token-mock.ts',

    // 2) prisma
    '^@/(?:lib/)?prismaClient(?:\\.(?:js|ts))?$':
      '<rootDir>/tests/_helper/prisma-mock.ts',
    '^.+/(?:lib/)?prismaClient(?:\\.(?:js|ts))?$':
      '<rootDir>/tests/_helper/prisma-mock.ts',

    // 3) alias 해석
    '^@/(.*)$': '<rootDir>/$1',

    // 4) 마지막에 .js 확장자 제거 규칙
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  setupFiles: ['<rootDir>/tests/_helper/jest.env.setup.ts'],
};
