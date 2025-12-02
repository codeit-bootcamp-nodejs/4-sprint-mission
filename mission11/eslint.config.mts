import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["src/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], // dist 제외
    languageOptions: {
      globals: globals.browser,
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    plugins: {
      js,
      "@typescript-eslint": tseslint.plugin,
    },
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      pluginReact.configs.flat.recommended,
    ],
    rules: {
      // 📌 require() 허용 (dist에서 나오는 require 경고 제거)
      "@typescript-eslint/no-require-imports": "off",

      // 📌 타입 any 허용 (점진적 개선 가능)
      "@typescript-eslint/no-explicit-any": "off",

      // 📌 unused 변수 무시
      "@typescript-eslint/no-unused-vars": "off",
    },
  },

  // 📌 dist 폴더는 ESLint 검사 제외
  {
    ignores: ["dist/**", "coverage/**"],
  },
]);
