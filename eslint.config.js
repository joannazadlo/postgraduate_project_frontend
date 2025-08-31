import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import reactPlugin from 'eslint-plugin-react';

const formattingRules = {
  'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
  'no-trailing-spaces': 'error',
  'padded-blocks': ['error', 'never'],
  'eol-last': ['error', 'always'],
  'space-before-blocks': ['error', 'always'],
  'keyword-spacing': ['error', { before: true, after: true }],
  'comma-spacing': ['error', { before: false, after: true }],
  'semi-spacing': ['error', { before: false, after: true }],
  'space-in-parens': ['error', 'never'],
};

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      'react': reactPlugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...formattingRules,
      'react/react-in-jsx-scope': 'off',
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },

  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
        project: './tsconfig.json',
      },
      globals: globals.browser,
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'react': reactPlugin,
      'react-hooks': reactHooks,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...formattingRules,

      'indent': ['error', 2, {
        SwitchCase: 1, ignoredNodes: [
          'TSTypeParameterInstantiation',
          'TSUnionType',
          'TSIntersectionType',
          'ConditionalExpression',
          'JSXElement',
          'JSXFragment',
        ]
      }],

      '@typescript-eslint/indent': 'off',

      'react/jsx-key': [
        'error',
        {
          checkFragmentShorthand: true,
          checkKeyMustBeforeSpread: true,
          warnOnDuplicates: true,
        },
      ],
      'react/button-has-type': 'error',
      'react/self-closing-comp': 'warn',
      'react/jsx-no-useless-fragment': 'warn',
      'react/display-name': 'warn',
      'react/prefer-stateless-function': 'warn',
      'react/no-unstable-nested-components': ['warn', { allowAsProps: true }],
      'react/jsx-pascal-case': 'error',
      'react/jsx-sort-props': ['warn', {
        callbacksLast: true,
        shorthandFirst: true,
        noSortAlphabetically: true,
        reservedFirst: true,
      }],

      'react/no-unused-prop-types': 'error',
      'react/jsx-no-script-url': 'error',
      'react/no-children-prop': 'error',
      'react/no-danger': 'error',
      'react/no-danger-with-children': 'error',
      'react/jsx-fragments': 'error',
      'react/destructuring-assignment': [
        'error',
        'always',
        { destructureInSignature: 'always' },
      ],
      'react/jsx-curly-brace-presence': 'warn',
      'react/no-typos': 'warn',
      'react/jsx-one-expression-per-line': 'off',
      'react/prop-types': 'off',

      '@typescript-eslint/no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'react/react-in-jsx-scope': 'off',
    },
  },
]
