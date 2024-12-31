import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 2022,
        sourceType: 'module',
      },
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        HTMLElement: 'readonly',
        HTMLImageElement: 'readonly',
        Element: 'readonly',
        MutationObserver: 'readonly',
        setTimeout: 'readonly',
        console: 'readonly',
        // Chrome extension globals
        chrome: 'readonly',
        // Jest globals
        jest: 'readonly',
        describe: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        // Node.js globals for scripts
        __dirname: 'readonly',
        Buffer: 'readonly',
        global: 'readonly'
      }
    },
    plugins: {
      '@typescript-eslint': typescript,
    },
    rules: {
      // Relax some strict rules
      '@typescript-eslint/explicit-function-return-type': ['error', {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
        allowHigherOrderFunctions: true,
        allowDirectConstAssertionInArrowFunctions: true,
      }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/strict-boolean-expressions': ['error', {
        allowString: true,
        allowNumber: true,
        allowNullableObject: true,
        allowNullableBoolean: true,
        allowNullableString: true,
        allowNullableNumber: true,
      }],
      '@typescript-eslint/no-unused-vars': ['error', { 
        argsIgnorePattern: '^_'
      }],
      'no-undef': 'off', // TypeScript handles this
    },
  },
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**']
  },
  prettier
]; 