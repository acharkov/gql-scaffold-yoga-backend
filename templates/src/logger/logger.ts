import process from 'node:process'
import { pino, LoggerOptions, destination } from 'pino'


const isDevelopment = process.env.NODE_ENV === 'development'

const pinoLevelToSeverityLookup = new Map([
	['trace', 'DEBUG'],
	['debug', 'DEBUG'],
	['info', 'INFO'],
	['warn', 'WARNING'],
	['error', 'ERROR'],
	['fatal', 'CRITICAL']
])

const options: LoggerOptions = {
	base: undefined,
	messageKey: 'message',
	level: process.env.LOG_LEVEL ?? 'info'
}

if (isDevelopment) {
	options.transport = {
		target: 'pino-pretty',
		options: {
			messageKey: 'message',
			levelFirst: true,
			translateTime: 'SYS: HH:MM:ss.l o'
		}
	}
} else {
	options.formatters = {
		level(label, number) {
			return {
				severity: pinoLevelToSeverityLookup.get(label) ?? 'INFO',
				level: number
			}
		}
	}

	const interval = setInterval(() => {
		logger.flush()
	}, 10_000)

	interval.unref()
}

const logger = isDevelopment
	? pino(options)
	: pino(options, destination({ minLength: 4096, sync: false }))

export default logger
