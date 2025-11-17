import { defineConfig } from "eslint/config";
import globals from "globals";
export default defineConfig([
  {
    files: ["**/*.js"],
    languageOptions: { globals: { ...globals.jest } },
    rules: { "no-unused-vars": "warn", "no-undef": "warn" },
  },
]);
