import { Redis } from 'ioredis'
import logger from '../logger/logger.js'


const { REDIS_URL } = process.env

if (!REDIS_URL) {
	throw new Error('REDIS_URL is required')
}

const RedisClient = new Redis(REDIS_URL)

RedisClient.on('error', (err) => {
	logger.error({ err }, 'Redis error')
})

export default RedisClient
