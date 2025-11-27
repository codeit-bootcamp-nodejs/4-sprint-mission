module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  // 테스트 파일 위치
  testMatch: ['**/src/**/*.test.ts'],

  // 커버리지 설정
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.test.ts',
    '!src/**/*.d.ts',
  ],

  // 모듈 파일 확장자
  moduleFileExtensions: ['ts', 'js', 'json'],

  // Transform 설정
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },

  // 타임아웃 설정 (통합 테스트를 위해)
  testTimeout: 10000,
};
