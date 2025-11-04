import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier/recommended';

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/*.config.ts',
      '**/*.config.mjs',
      'scripts/**',
    ],
  },
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': [
        'error', // 또는 'warn'
        {
          varsIgnorePattern: '^_', // _(언더스코어)로 시작하는 변수는 무시
          argsIgnorePattern: '^_', // _(언더스코어)로 시작하는 매개변수도 무시
        },
      ],
    },
  },
  prettier,
];
