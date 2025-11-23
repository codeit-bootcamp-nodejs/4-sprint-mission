"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src', '<rootDir>/tests'], // ✅ src와 tests 폴더 안에서 테스트 찾기
    testMatch: ['**/*.test.ts'], // ✅ .test.ts 파일 전부 매칭
    clearMocks: true,
};
exports.default = config;
