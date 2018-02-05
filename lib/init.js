
const { db } = require('mono-mongodb')

module.exports = async ({ log, conf }) => {
	const { sessionKey, collectionName } = conf.mono.notifications

	log.info(`Ensuring ${collectionName} collection`)

	const collection = await db.createCollection(collectionName)

	log.info(`Ensuring ${collectionName} read TTL`)

	await collection.ensureIndex({ expireAt: 1 }, { expireAfterSeconds: 0 })

	log.info(`Ensuring ${collectionName} index ${sessionKey}`)

	await collection.createIndex({ [sessionKey]: 1 })
	await collection.createIndex({ [sessionKey]: 1, read: 1 })
}
