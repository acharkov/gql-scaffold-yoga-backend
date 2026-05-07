import { createModule } from 'graphql-modules'
import { loadFiles } from '@graphql-tools/load-files'
import { BigIntResolver, TimestampResolver, JSONResolver } from 'graphql-scalars'


const commonResolvers = {
	BigInt: BigIntResolver,
	Timestamp: TimestampResolver,
	JSON: JSONResolver,
	Query: {
		_ping: () => 'pong'
	}
}

export const CommonModule = createModule({
	id: 'common',
	typeDefs: await loadFiles('./src/modules/common/*.gql'),
	resolvers: [commonResolvers]
})
