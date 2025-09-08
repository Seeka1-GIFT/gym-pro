module.exports = {
	root: true,
	env: { browser: true, es2021: true },
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:react/recommended',
		'plugin:react-hooks/recommended',
		'plugin:import/recommended',
		'plugin:import/typescript',
		'airbnb',
		'plugin:prettier/recommended'
	],
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint', 'react', 'react-hooks', 'import'],
	rules: {
		'react/react-in-jsx-scope': 'off',
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
		'consistent-return': 'error'
	},
	settings: {
		react: { version: 'detect' },
		'import/resolver': {
			typescript: {
				project: ['./tsconfig.json']
			}
		}
	}
};

