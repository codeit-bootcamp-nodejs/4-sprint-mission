// eslint.config.ts
import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import pluginImport from 'eslint-plugin-import';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';

export default [
  {
    ignores: ['node_modules/**', 'prisma/**', 'src/generated/**', 'dist'],
  },
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      env: { node: true },
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json', // 타입 체크 필요 시
      },
      globals: { ...globals.node, process: 'readonly' },
    },
    plugins: {
      'simple-import-sort': simpleImportSort,
      import: pluginImport,
      '@typescript-eslint': tsPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.json', // path alias 자동 인식
        },
      },
    },
    rules: {
      // import 정렬
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',

      // import 관련
      'import/extensions': [
        'error',
        'ignorePackages',
        { ts: 'always', tsx: 'always' },
      ],
      'import/no-unresolved': 'error',

      // TypeScript 권장 룰
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'off',

      // JS 기본 스타일 보완
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
  // 테스트 파일 전용 완화
  {
    files: ['**/*.test.ts', '**/*.test.tsx', 'vitest.config.ts'],
    rules: {
      'no-unused-expressions': 'off',
      'import/no-unresolved': 'off',
    },
  },
];
