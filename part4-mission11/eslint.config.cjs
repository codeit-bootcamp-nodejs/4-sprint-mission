const importPlugin = require('eslint-plugin-import');
const jestPlugin = require('eslint-plugin-jest');
const globals = require('globals');
const tseslint = require('typescript-eslint');

module.exports = [
  // 예외(무시) 경로
  { ignores: ['node_modules/**', 'dist/**', 'coverage/**', 'generated/**'] },

  // 기본 규칙 세트
  {
    files: ['**/*.{ts,tsx,js,cjs}'],
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.node, ...globals.es2022 },
      parserOptions: {
        project: false,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      import: importPlugin,
      jest: jestPlugin,
    },
    settings: {
      'import/resolver': { typescript: {} },
    },
    rules: {
      // @typescript-eslint 권장 규칙 기반
      ...tseslint.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'error',

      // 사용 규칙 커스터마이즈
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'import/no-unresolved': 'off',
      'import/order': [
        'warn',
        {
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
          groups: [
            ['builtin', 'external'],
            ['internal', 'parent', 'sibling', 'index'],
          ],
        },
      ],

      // 기본 no-unused-vars는 끄고 TS 버전만 사용
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },

  //  테스트 전용 오버라이드 (Jest 전역/규칙)
  {
    files: ['**/src/tests/**/*', '**/*.test.{ts,tsx,js}'],
    languageOptions: {
      globals: { ...globals.node, ...globals.jest },
    },
    rules: {
      'no-console': 'off', // 테스트 로그 허용
    },
  },

  // CommonJS 설정 파일(.cjs) 허용
  {
    files: ['**/*.cjs'],
    languageOptions: { sourceType: 'script' },
  },

  {
    files: ['**/*.d.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },

  {
    files: ['src/prisma/seed.ts', 'src/middlewares/logger.ts', 'src/app.ts'],
    rules: { 'no-console': 'off' },
  },
];
