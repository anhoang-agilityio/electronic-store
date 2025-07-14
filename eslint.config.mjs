import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import prettier from 'eslint-plugin-prettier';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import checkFile from 'eslint-plugin-check-file';
import importPlugin from 'eslint-plugin-import';
import tsParser from '@typescript-eslint/parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default tseslint.config(
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    files: ['**/*.{ts,tsx}'],
    ignores: [
      'dist',
      'node_modules',
      '.next',
      'generators',
    ],
    extends: [
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
      prettierRecommended,
    ],
    languageOptions: {
      globals: globals.browser,
      parser: tsParser,
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
    },
    settings: { react: { version: 'detect' } },
    plugins: {
      'react-hooks': reactHooks,
      'check-file': checkFile,
      import: importPlugin,
      prettier: prettier,
      react,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...importPlugin.flatConfigs.recommended.rules,
      ...importPlugin.flatConfigs.typescript.rules,
      'no-console': 'error',
      'no-unused-vars': 'off',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-unused-vars': ['error'],
      '@typescript-eslint/explicit-function-return-type': ['off'],
      '@typescript-eslint/explicit-module-boundary-types': ['off'],
      '@typescript-eslint/no-empty-function': ['off'],
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      'prettier/prettier': ['error', {}, { usePrettierrc: true }],
      'import/no-cycle': 'error',
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import/default': 'off',
      'import/no-named-as-default-member': 'off',
      'import/no-named-as-default': 'off',
    },
  },
  {
    files: ['src/**/*'],
    plugins: {
      'check-file': checkFile,
    },
    rules: {
      'check-file/filename-naming-convention': [
        'error',
        {
          '**/*.{ts,tsx}': 'KEBAB_CASE',
        },
        {
          ignoreMiddleExtensions: true,
        },
      ],
      'check-file/folder-naming-convention': [
        'error',
        {
          '!(src/app)/**/*': 'KEBAB_CASE',
          '!(**/__tests__)/**/*': 'KEBAB_CASE',
        },
      ],
    },
  },
);
