import pkg, { PoolClient } from 'pg'


pkg.types.setTypeParser(1700, parseFloat) // NUMERIC OID → number

const { Pool } = pkg

const { PSQL_URL } = process.env

const pool = new Pool({
	connectionString: PSQL_URL,
})

pool.on('connect', async (client) => {
	await client.query('SELECT NOW()')
})

async function pgTx<T>(
	dbOperations: (client: PoolClient) => Promise<T>): Promise<T> {

	const client: PoolClient = await pool.connect()
	try {
		await client.query('BEGIN')
		const result: T = await dbOperations(client)
		await client.query('COMMIT')
		return result
	} catch (err) {
		await client.query('ROLLBACK')
		throw err
	} finally {
		client.release()
	}
}

export { pgTx }

export default pool
