import { createPubSub } from '@graphql-yoga/subscription'
import { Redis } from 'ioredis'
import { createRedisEventTarget } from '@graphql-yoga/redis-event-target'


const { REDIS_URL } = process.env

if (!REDIS_URL) {
	throw new Error('REDIS_URL is required')
}

const publishClient = new Redis(REDIS_URL)
const subscribeClient = new Redis(REDIS_URL)

const eventTarget = createRedisEventTarget({
	publishClient,
	subscribeClient
})

export type PubSubTopics = {
	// Add your topics here, e.g.:
	// ITEM_CREATED: [payload: { itemCreated: { id: number } }]
	// ITEM_UPDATED_PER_USER: [userId: number, payload: { itemUpdatedPerUser: { id: number } }]
}

export const pubSub = createPubSub<PubSubTopics>({ eventTarget })
