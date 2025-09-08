module.exports = {
	root: true,
	env: { node: true, es2021: true },
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:import/recommended',
		'plugin:import/typescript',
		'airbnb-base',
		'plugin:prettier/recommended'
	],
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint', 'import'],
	rules: {
		'no-unused-vars': 'error',
		'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
		'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
		'no-duplicate-imports': 'error',
		'import/order': [
			'error',
			{
				'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
				'newlines-between': 'always',
				'alphabetize': { order: 'asc', caseInsensitive: true }
			}
		],
		'consistent-return': 'error',
		'import/no-extraneous-dependencies': ['error', { devDependencies: ['**/scripts/**', '**/*.test.ts', '**/*.spec.ts'] }]
	},
	settings: {
		'import/resolver': {
			typescript: {
				project: ['./tsconfig.json']
			}
		}
	}
};

