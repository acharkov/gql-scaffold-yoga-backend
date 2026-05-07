import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { createApplication } from 'graphql-modules'
import { defaultFieldResolver, GraphQLError, GraphQLSchema } from 'graphql'
import { CommonModule } from './common/common.schema.js'


export const application = createApplication({
	modules: [
		CommonModule,
	],

	schemaBuilder: ({ typeDefs, resolvers }: { typeDefs: any; resolvers: any }) => {
		const schema = makeExecutableSchema({ typeDefs, resolvers })
		return patchSchema(schema)
	}
})

function patchSchema(schema: GraphQLSchema): GraphQLSchema {
	const directiveTransformers = [
		atLeastModerTransform,
	]

	return directiveTransformers
		.reduce((currentSchema, transformer) => transformer(currentSchema), schema)
}

function atLeastModerTransform(schema: GraphQLSchema): GraphQLSchema {
	return mapSchema(schema, {
		[MapperKind.OBJECT_FIELD]: (fieldConfig) => {
			const directive = getDirective(schema, fieldConfig, 'atLeastModer')?.[0]

			if (!directive) {
				return fieldConfig
			}

			const { resolve = defaultFieldResolver } = fieldConfig

			return {
				...fieldConfig,
				resolve: async function (source, args, context, info) {
					if (!context.user) {
						return null
					}

					if (source?.id && context.user.getId?.() === source.id) { return resolve(source, args, context, info) }
					if (context.user.isAtLeastModer?.()) { return resolve(source, args, context, info) }

					if (!source) {
						throw new GraphQLError('Forbidden', { extensions: { code: 'FORBIDDEN' } })
					}

					return null
				}
			}
		}
	})
}
