const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  transform: {
    "\\.[jt]sx?$": "ts-jest",
  },
  globals: {
    transform: { "\\.[jt]sx?$": ["ts-jest", { useESM: true }] },
  },
  moduleNameMapper: {
    "^(\\.\\.?\\/.+)\\.js$": "$1",
  },

  extensionsToTreatAsEsm: [".ts"],
};
