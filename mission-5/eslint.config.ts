import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import unusedImports from 'eslint-plugin-unused-imports';

export default defineConfig([
  // 기본 및 TypeScript 규칙 적용
  // 기존 extends의 "eslint:recommended", "plugin:@typescript-eslint/recommended"에 해당합니다.
  ...tseslint.configs.recommended,

  // 프로젝트 전역 설정
  {
    // 기존 ignorePatterns에 해당합니다.
    ignores: ['dist/', 'node_modules/'],
    // 언어 및 환경 설정
    languageOptions: {
      // 파서 및 파서 옵션 설정
      // 기존 parser, parserOptions에 해당합니다.
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 2024,
        sourceType: 'module',
      },

      // 실행 환경 설정
      // 기존 env에 해당합니다.
      globals: {
        ...globals.node,
        ...globals.es2024,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'unused-imports': unusedImports,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error', // 'error'로 설정해야 자동 수정됩니다.
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
  // Prettier와 충돌되는 규칙 비활성화
  // 기존 extends의 "plugin:prettier/recommended", "prettier/@typescript-eslint"에 해당합니다.
  eslintConfigPrettier,
  eslintPluginPrettierRecommended,
]);
