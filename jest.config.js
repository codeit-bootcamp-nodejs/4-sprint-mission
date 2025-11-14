module.exports = {
  preset: "ts-jest",

  testEnvironment: "node",

  collectCoverage: true,

  coverageDirectory: "coverage",

  coverageProvider: "v8",

  testMatch: [
    "**/__tests__/**/*.test.[jt]s?(x)",
    "**/?(*.)+(spec|test).[jt]s?(x)",
  ],
};
