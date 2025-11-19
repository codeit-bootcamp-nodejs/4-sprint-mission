/** @type {import('jest').Config} */
module.exports = {
  projects: ['<rootDir>/jest.unit.config.cjs', '<rootDir>/jest.int.config.cjs'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
};
