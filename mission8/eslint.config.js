import { default as js } from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import pluginImport from 'eslint-plugin-import';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
export default [
  {
    ignores: ['node_modules/**', 'prisma/**', 'generated/**/*', 'dist'],
  },
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
      globals: { ...globals.node, ...globals.jest, process: 'readonly' },
    },
    plugins: {
      import: pluginImport,
      'simple-import-sort': simpleImportSort,
      '@typescript-eslint': tsPlugin,
    },
    settings: {
      'import/resolver': {
        node: true,
        typescript: {
          project: './tsconfig.json',
        },
      },
    },

    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'import/extensions': ['error', 'ignorePackages', { ts: 'never', tsx: 'never' }],
      'import/no-unresolved': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];
