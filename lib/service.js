
const { conf } = require('mono-core')
const { db, oid } = require('mono-mongodb')
const mongoUtils = require('mongodb-utils')

const notificationModule = mongoUtils(db.collection(conf.mono.notifications.collectionName))

const { sessionKey } = conf.mono.notifications

module.exports = {
	add(userId, payload) {
		return notificationModule.utils.create({
			[sessionKey]: userId,
			payload,
			read: false
		})
	},
	count(userId, read) {
		return notificationModule.count({
			[sessionKey]: userId,
			read
		})
	},
	list(userId, options) {
		const query = { [sessionKey]: userId }

		if (options && typeof options.read !== 'undefined') query.read = options.read

		return notificationModule.utils.find(query, options)
	},
	read(userId, notificationsId) {
		const ttl = conf.mono.notifications.ttl
		const expireAt = new Date(Date.now() + ttl)
		notificationsId = (Array.isArray(notificationsId)) ? notificationsId : [notificationsId]

		const promises = notificationsId.map(async (notificationId) => {
			return notificationModule.utils.update({ [sessionKey]: userId, _id: oid(notificationId) }, {
				expireAt,
				read: true
			})
		})

		return Promise.all(promises)
	}
}
