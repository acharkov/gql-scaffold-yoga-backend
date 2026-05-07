import { App } from 'uWebSockets.js'
import { yoga, wsHandler } from './yoga.js'
import logger from './logger/logger.js'
import { handleHealthz } from './routes/healthz.js'


const { PORT, ROOT_URL } = process.env

if (!PORT) {
	throw new Error('PORT is not defined')
}

if (!ROOT_URL) {
	throw new Error('ROOT_URL is not defined')
}

const PORT_INT = parseInt(PORT, 10) || 4000

App()
	.any('/*', yoga)
	.get('/healthz', handleHealthz)
	.ws(yoga.graphqlEndpoint, wsHandler)
	.listen(PORT_INT, () => {
		logger.info(`SERVER IS RUNNING on ${ROOT_URL}/graphql`)
	})
