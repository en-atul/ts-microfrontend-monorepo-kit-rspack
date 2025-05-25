import path from 'path';
import tseslint from 'typescript-eslint';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginReact from 'eslint-plugin-react';
import pluginImport from 'eslint-plugin-import';
import pluginPrettier from 'eslint-plugin-prettier';
import globals from 'globals';
import { config as baseConfig } from './base.js';

/** @type {(projectDirName: string) => import("eslint").Linter.Config[]} */
export const reactJsConfig = (projectDirName) => [
	...baseConfig,
	{
		files: ['**/*.ts', '**/*.tsx'],
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				ecmaVersion: 2020,
				sourceType: 'module',
				project: path.resolve(projectDirName, './tsconfig.json'),
				tsconfigRootDir: projectDirName,
			},
			globals: {
				...globals.browser,
			},
		},
		plugins: {
			'@typescript-eslint': tseslint.plugin,
			import: pluginImport,
			prettier: pluginPrettier,
		},
		rules: {
			'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
			'@typescript-eslint/consistent-type-assertions': 'warn',
			'@typescript-eslint/no-explicit-any': 'error',
			'@typescript-eslint/no-inferrable-types': 'warn',
			'@typescript-eslint/no-non-null-assertion': 'error',
			'@typescript-eslint/naming-convention': [
				'warn',
				{
					selector: 'variable',
					format: ['camelCase', 'PascalCase'],
					leadingUnderscore: 'allow',
				},
				{
					selector: 'typeLike',
					format: ['PascalCase'],
				},
				{
					selector: 'enum',
					format: ['UPPER_CASE'],
				},
				{
					selector: 'enumMember',
					format: ['UPPER_CASE'],
				},
				{
					selector: 'function',
					format: ['camelCase'],
				},
				{
					selector: 'variable',
					types: ['function'],
					format: ['PascalCase'],
					filter: {
						regex: '^[A-Z]',
						match: true,
					},
				},
				{
					selector: 'parameter',
					format: ['camelCase'],
					leadingUnderscore: 'allow',
				},
				{
					selector: 'property',
					format: null,
					leadingUnderscore: 'allow',
				},
				{
					selector: 'typeParameter',
					format: ['PascalCase'],
					prefix: ['T', 'K'],
				},
				{
					selector: ['variableLike'],
					types: ['boolean'],
					format: ['PascalCase'],
					prefix: ['can', 'did', 'has', 'is', 'must', 'needs', 'should', 'will'],
				},
			],
			'no-console': ['warn', { allow: ['warn', 'error'] }],
			'no-debugger': 'error',
			'consistent-return': 'error',
			eqeqeq: ['error', 'always'],
			'no-throw-literal': 'error',
			'no-implicit-coercion': 'error',
			'import/default': 'error',
			'import/no-cycle': ['error', { maxDepth: Infinity }],
			'import/no-unresolved': 'error',
			'import/order': [
				'warn',
				{
					'newlines-between': 'always',
					alphabetize: {
						order: 'asc',
					},
				},
			],
			quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: false }],
			'prettier/prettier': 'error',
			semi: ['warn', 'always'],
			'no-nested-ternary': 'warn',
			'no-implicit-globals': 'warn',
			curly: ['warn', 'all'],
			'prefer-arrow-callback': 'warn',
			complexity: ['warn', { max: 10 }],
		},
	},
	{
		files: ['**/*.js'],
		languageOptions: {
			globals: {
				...globals.browser,
			},
		},
		rules: {
			'no-undef': 'off',
		},
	},
	{
		files: ['*.spec.ts', '*.spec.tsx', '*.test.ts', '*.test.tsx'],
		rules: {
			'@typescript-eslint/no-explicit-any': 'off',
		},
	},
	{
		files: ['**/*.{ts,tsx,js,jsx}'],
		plugins: {
			react: pluginReact,
			'react-hooks': pluginReactHooks,
		},
		settings: {
			react: { version: 'detect' },
		},
		rules: {
			...pluginReact.configs.recommended.rules,
			...pluginReactHooks.configs.recommended.rules,
			'react/react-in-jsx-scope': 'off',
		},
	},
];
