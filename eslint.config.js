import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    ignores: [
      'dist/',
      'node_modules/',
      'coverage/',
      '*.config.js',
      'clients/thirdparty/',
      'clean.cjs'
    ]
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      'eol-last': 'error',
      'no-tabs': 'error',
      'prefer-const': 'error',
      'array-bracket-spacing': ['error', 'never'],
      'no-return-await': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern': '^_', 'varsIgnorePattern': '^_' }],
      '@typescript-eslint/no-empty-function': 'warn',
      'no-empty': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-inferrable-types': 'off',
      'react/react-in-jsx-scope': 'off'
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        requestAnimationFrame: 'readonly',
        performance: 'readonly',
        FileReader: 'readonly',
        Blob: 'readonly',
        Image: 'readonly',
        fetch: 'readonly',
        saveAs: 'readonly',
        FPSMeter: 'readonly',
        JSZip: 'readonly',
        ImageData: 'readonly',
      },
    },
    rules: {
      'eol-last': 'error',
      'no-tabs': 'error',
      'prefer-const': 'error',
      'array-bracket-spacing': ['error', 'never'],
      'no-return-await': 'error',
      'no-unused-vars': ['error', { 'argsIgnorePattern': '^_', 'varsIgnorePattern': '^_' }],
      'no-empty': 'warn',
    },
  }
);