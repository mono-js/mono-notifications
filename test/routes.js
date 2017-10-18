const test = require('ava')
const { join } = require('path')

const mongoUtils = require('mongodb-utils')

const { jwt } = require('@terrajs/mono')
const { start, stop, $get, $put } = require('mono-test-utils')
const mongoModule = require('mono-mongodb')
const monoNotifications = require('../lib/index')

const userModel = {
	username: 'mono-user'
}

const notificationsModel = [{
	title: 'first notification',
	description: 'this is the description test'
}, {
	title: 'second notification',
	description: 'this is the description test'
}, {
	title: 'third notification',
	description: 'this is the description test'
}, {
	title: 'fourth notificaton',
	description: 'this is the description test'
}]

let ctx
let requestHeader

test('Start mono with routes context and create user', async (t) => {
	ctx = await start(join(__dirname, 'fixtures/ok/'))

	const usersModule = mongoUtils(mongoModule.db.collection('users'))

	const user = await usersModule.utils.create(userModel)
	userModel._id = user._id
	const accessToken = await jwt.generateJWT({ userId: userModel._id })

	requestHeader = {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	}

	t.pass()
})

test('/notifications should return the created notification', async (t) => {
	await monoNotifications.add(userModel._id, notificationsModel[0])
	await monoNotifications.add(userModel._id, notificationsModel[1])

	const { body } = await $get('/notifications', requestHeader)

	t.true(Array.isArray(body.items))
	t.is(body.items.length, 2)
	t.is(body.items[0].read, false)
})

test('/notifications/count should return the number of unread notification', async (t) => {
	const request = await $get('/notifications/count', requestHeader)

	t.is(request.body, 2)
})

test('/notification/read should set specified notifications as read', async (t) => {
	const query = Object.assign(requestHeader, {
		qs: {
			read: true
		},
		body: [notificationsModel[0]._id]
	})

	const { statusCode } = await $put('/notifications/read', requestHeader)

	t.is(statusCode, 200)

	const result = await $get('/notifications', query)

	t.true(Array.isArray(result.body.items))
	t.is(result.body.items.length, 2)
})

test('/notifications should mark all notifications as read on get', async (t) => {
	await monoNotifications.add(userModel._id, notificationsModel[2])
	const query = Object.assign(requestHeader, {
		qs: {
			markRead: true
		}
	})

	const { body } = await $get('/notifications', query)

	t.true(Array.isArray(body.items))
	t.is(body.items.length, 3)

	const request = await $get('/notifications/count', requestHeader)

	t.is(request.body, 0)
})

test('/notifications/:id/read should read the notification', async (t) => {
	const { db } = require('mono-mongodb')

	const notification = await monoNotifications.add(userModel._id, notificationsModel[3])
	const { statusCode } = await $put(`/notifications/${notification._id}/read`, requestHeader)

	t.is(statusCode, 200)

	const notificationModule = mongoUtils(db.collection(ctx.conf.mono.notifications.collectionName))
	const notificationFind = await notificationModule.utils.get(notification._id)

	t.true(notificationFind.read)
})

test.after('Close mono instance', async () => {
	await stop(ctx.server)
})
