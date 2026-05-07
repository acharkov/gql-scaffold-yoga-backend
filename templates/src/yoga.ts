import { PubSub, YogaInitialContext, createYoga } from 'graphql-yoga'
import { useGraphQLModules } from '@envelop/graphql-modules'
import { HttpRequest, HttpResponse } from 'uWebSockets.js'
import { execute, ExecutionArgs, subscribe } from 'graphql'
import { makeBehavior } from 'graphql-ws/use/uWebSockets'
import { IdentifyFn, useRateLimiter } from '@envelop/rate-limiter'
import { useDepthLimit } from '@envelop/depth-limit'
import { application } from './modules/schema.js'
import { pubSub, PubSubTopics } from './pubsub.js'
import logger from './logger/logger.js'


interface ServerContext {
	req: HttpRequest,
	res: HttpResponse
}

export interface ContextType {
	user: null
	pubSub: PubSub<PubSubTopics>
}

type EnvelopedExecutionArgs = ExecutionArgs & {
	rootValue: {
		execute: typeof execute
		subscribe: typeof subscribe
	}
}

const { NODE_ENV } = process.env

const identifyContextFn: IdentifyFn = (context) => {
	const ctx = context as ServerContext
	const ip = ctx.res ? Buffer.from(ctx.res.getProxiedRemoteAddressAsText()).toString() || Buffer.from(ctx.res.getRemoteAddressAsText()).toString() : 'unknown'

	return ip
}

export const yoga = createYoga<ServerContext>({
	plugins: [
		useGraphQLModules(application),
		useRateLimiter({ identifyFn: identifyContextFn }),
		useDepthLimit({ maxDepth: 6 }),
	],

	cors: NODE_ENV === 'production'
		? { origin: [], credentials: true }
		: {},

	context: async (_ctx: YogaInitialContext): Promise<ContextType> => {
		return {
			user: null,
			pubSub,
		}
	},

	graphiql: NODE_ENV === 'production'
		? false
		: { subscriptionsProtocol: 'WS' }
})

export const wsHandler = makeBehavior({
	execute: args => (args as EnvelopedExecutionArgs).rootValue.execute(args),
	subscribe: args => (args as EnvelopedExecutionArgs).rootValue.subscribe(args),
	onConnect: (ctx) => {
		logger.debug({ origin: ctx.extra?.persistedRequest?.headers?.origin }, 'WS connected')
	},
	onSubscribe: async (ctx, _id, params) => {
		const { schema, execute, subscribe, contextFactory, parse, validate } = yoga.getEnveloped(ctx)

		const args: EnvelopedExecutionArgs = {
			schema,
			operationName: params.operationName,
			document: parse(params.query),
			variableValues: params.variables,
			contextValue: {
				...(await contextFactory()),
			},
			rootValue: {
				execute,
				subscribe
			}
		}

		const errors = validate(args.schema, args.document)
		if (errors.length) return errors
		return args
	}
})
