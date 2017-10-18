
const { db } = require('mono-mongodb')

module.exports = async ({ log, conf }) => {
	const collectionName = conf.mono.notifications.collectionName
	log.info(`Ensuring ${collectionName} collection`)

	const collection = await db.createCollection(collectionName)

	log.info(`Ensuring ${collectionName} read TTL`)

	await collection.ensureIndex({ expireAt: 1 }, { expireAfterSeconds: 0 })

	log.info(`Ensuring ${collectionName} index read`)

	await collection.createIndex({ read: 1 })
}
