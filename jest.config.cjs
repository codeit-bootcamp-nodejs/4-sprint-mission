/** @type {import("jest").Config} */
module.exports = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^@prisma/client$": "<rootDir>/__mocks__/prisma.ts",
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: {
          module: "nodenext",
          moduleResolution: "nodenext",
        },
      },
    ],
  },
  testMatch: ["**/jest/**/*.test.ts"],
  collectCoverageFrom: [
    "controllers/**/*.ts",
    "services/**/*.ts",
    "middlewares/**/*.ts",
    "routes/**/*.ts",
    "!**/*.d.ts",
    "!**/node_modules/**",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html", "json"],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  setupFilesAfterEnv: ["<rootDir>/jest/setup.js"],
  transformIgnorePatterns: [
    "node_modules/(?!(.*\\.mjs$|dotenv))",
  ],
};
