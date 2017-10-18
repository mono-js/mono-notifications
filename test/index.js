const test = require('ava')

const { join } = require('path')

const { start, stop } = require('mono-test-utils')
const mongoModule = require('mono-mongodb')

const mongoUtils = require('mongodb-utils')

const monoNotifications = require('../lib/index')

const userModel = {
	username: 'neo9-test'
}

const notificationModel = {
	title: 'new notification',
	description: 'this is the description test'
}

let ctx

test.before('Init mono and create user test', async () => {
	ctx = await start(join(__dirname, '/fixtures/ok/'))

	const usersModule = mongoUtils(mongoModule.db.collection('users'))

	const user = await usersModule.utils.create(userModel)
	userModel._id = user._id
})

test('monoNotifications.add should create a notification', async (t) => {
	t.true(monoNotifications.add instanceof Function)

	await monoNotifications.add(userModel._id, notificationModel)
})

test('monoNotifications.list should return the created notifications', async (t) => {
	const stream = monoNotifications.list(userModel._id, {
		read: false
	})
	const notifications = await stream.toArray()

	t.is(notifications.length, 1)
	t.is(notifications[0].payload.title, notificationModel.title)
	t.is(notifications[0].payload.description, notificationModel.description)

	notificationModel._id = notifications[0]._id
})

test('monoNotifications.read should change the notification as readed', async (t) => {
	await monoNotifications.read(userModel._id, notificationModel._id)

	const stream = monoNotifications.list(userModel._id, {
		read: true
	})
	const notifications = await stream.toArray()

	t.is(notifications.length, 1)
	t.is(notifications[0].read, true)
})

test('monoNotifications.read with numerical ttl should work', async (t) => {
	// We set 1s of ttl
	ctx.conf.mono.notifications.ttl = 1000

	await monoNotifications.read(userModel._id, [notificationModel._id])

	const stream = monoNotifications.list(userModel._id)
	const notifications = await stream.toArray()

	t.is(notifications.length, 1)
	t.true(+notifications[0].expireAt > Date.now())
	t.true(+notifications[0].expireAt < +new Date(Date.now() + 1500))

	await stop(ctx.server)
})

test('should have custom configuration loaded', async (t) => {
	ctx = await start(join(__dirname, '/fixtures/ok/'), { env: 'test2' })

	t.true(ctx.stdout.join().includes('[mono-notifications:mono-notifications] Ensuring custom-mono-notifications collection'))

	await monoNotifications.add(userModel._id, notificationModel)
	await stop(ctx.server)
})
