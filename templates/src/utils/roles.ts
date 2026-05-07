import { GraphQLError } from 'graphql'


export function checkAuth(user: unknown): asserts user {
	if (!user) {
		throw new GraphQLError('Unauthorized', { extensions: { code: 'UNAUTHORIZED' } })
	}
}
