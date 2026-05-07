import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import-x';


export default [
	{
		files: ['**/*.{js,mjs,cjs,ts}']
	},
	{
		ignores: [
			'**/.dist/**/*',
			'**/*.queries.ts'
		]
	},
	{
		languageOptions: {
			globals: globals.nodeBuiltin
		}
	},
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	importPlugin.flatConfigs.recommended,
	{
		rules: {
			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': 'off',
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/no-empty-object-type': 'warn',
			'quotes': ['error', 'single'],
			'indent': [2, 'tab'],
			'import-x/newline-after-import': ['error', { 'count': 2 }],
			'import-x/no-unresolved': 'off',
			'import-x/named': 'off',
			'object-curly-spacing': ['error', 'always']
		}
	}
];
