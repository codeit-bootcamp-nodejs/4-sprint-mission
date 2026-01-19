module.exports = {
  rootDir: __dirname,
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': [
      '@swc/jest',
      {
        jsc: { parser: { syntax: 'typescript', tsx: false }, target: 'es2020' },
        module: { type: 'es6' },
      },
    ],
  },
  extensionsToTreatAsEsm: ['.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  collectCoverageFrom: [
    '**/*.ts',
    '!**/app.ts',
    '!**/swagger.ts',
    '!**/ws.ts',
    '!tests/**',
    '!tests/_helper/**',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/tests/',
    '<rootDir>/tests/_helper/',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '<rootDir>/tests/_helper/',
  ],
};
