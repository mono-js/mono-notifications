const { conf } = require('@terrajs/mono')
const { getFindOptions, FindStream } = require('mono-mongodb')
const routeName = conf.mono.notifications.routeName

const notificationModule = require('./index')
const validation = require('./routes.validation')

module.exports = [
	{
		method: 'get',
		path: `/${routeName}`,
		session: true,
		validation: validation,
		async handler(req, res) {
			const options = getFindOptions(req.query)
			const userId = req.session.userId
			const total = await notificationModule.count(userId)
			const stream = notificationModule.list(userId, options)

			const listStream = new FindStream({
				total,
				res,
				...options
			})

			stream.pipe(listStream).pipe(res)

			// Set notifications as read if markRead is set as true
			if (req.query.markRead === 'true') {
				const notifications = await notificationModule.list(userId, options).toArray()
				const unreadNotifications = notifications.filter((notification) => !notification.read)

				await notificationModule.read(userId, unreadNotifications.map((notification) => notification._id))
			}
		}
	},
	{
		method: 'get',
		path: `/${routeName}/count`,
		session: true,
		async handler(req, res) {
			const userId = req.session.userId

			const count = await notificationModule.count(userId, false)

			res.json(count)
		}
	},
	{
		method: 'put',
		path: `/${routeName}/read`,
		session: true,
		async handler(req, res) {
			const userId = req.session.userId
			const notificationsId = req.body

			await notificationModule.read(userId, notificationsId)

			res.sendStatus(200)
		}
	},
	{
		method: 'put',
		path: `/${routeName}/:id/read`,
		session: true,
		async handler(req, res) {
			const userId = req.session.userId
			const notificationId = req.params.id

			await notificationModule.read(userId, notificationId)

			res.sendStatus(200)
		}
	}
]
