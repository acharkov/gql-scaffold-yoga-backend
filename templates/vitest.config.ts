import { defineConfig } from 'vitest/config';
import { loadEnv } from 'vite';


export default defineConfig(({ mode }) => {
	const env = loadEnv(mode ?? 'development', process.cwd(), '');

	for (const key of Object.keys(env)) {
		process.env[key] = env[key];
	}

	return {
		test: {
			env,
			globals: true,
			environment: 'node',
			exclude: ['./.dist', './node_modules']
		},
	};
});
