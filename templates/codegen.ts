import type { CodegenConfig } from '@graphql-codegen/cli'


const config: CodegenConfig = {
	schema: './src/modules/**/*.gql',
	emitLegacyCommonJSImports: false,
	generates: {
		'./src/modules/': {
			preset: 'graphql-modules',
			presetConfig: {
				baseTypesPath: '../generated-types/graphql.ts',
				filename: 'generated-types/module-types.ts'
			},
			plugins: [
				{
					add: {
						content: '/* eslint @typescript-eslint/no-empty-object-type: \'off\', @typescript-eslint/no-explicit-any: \'off\', @typescript-eslint/no-namespace: \'off\' */'
					}
				},
				'typescript',
				'typescript-resolvers'
			],
		}
	},
	hooks: {
		afterAllFileWrite: ['npx eslint --fix']
	}
}

export default config
