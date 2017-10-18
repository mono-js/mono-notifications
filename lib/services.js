
const { conf } = require('@terrajs/mono')
const { db, oid } = require('mono-mongodb')
const mongoUtils = require('mongodb-utils')

const notificationModule = mongoUtils(db.collection(conf.mono.notifications.collectionName))

module.exports = {
	add(userId, payload) {
		return notificationModule.utils.create({
			userId: oid(userId),
			payload,
			read: false
		})
	},
	count(userId, read) {
		return notificationModule.count({
			userId: oid(userId),
			read
		})
	},
	list(userId, options) {
		const query = { userId: oid(userId) }

		if (options && typeof options.read !== 'undefined') query.read = options.read

		return notificationModule.utils.find(query, options)
	},
	read(userId, notificationsId) {
		const ttl = conf.mono.notifications.ttl
		const expireAt = new Date(Date.now() + ttl)
		notificationsId = (Array.isArray(notificationsId)) ? notificationsId : [notificationsId]

		const promises = notificationsId.map(async (notificationId) => {
			return notificationModule.utils.update({ userId: oid(userId), _id: oid(notificationId) }, {
				expireAt,
				read: true
			})
		})

		return Promise.all(promises)
	}
}
