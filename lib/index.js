const ms = require('ms')

module.exports = function ({ conf }) {
	// Default configuration
	const monoNotificationconf = conf.mono.notifications || {}
	monoNotificationconf.collectionName = monoNotificationconf.collectionName || 'mono-notifications'
	monoNotificationconf.routeName = monoNotificationconf.routeName || 'notifications'
	monoNotificationconf.ttl = monoNotificationconf.ttl || '30 days'
	monoNotificationconf.ttl = (typeof monoNotificationconf.ttl === 'string') ? ms(monoNotificationconf.ttl) : monoNotificationconf.ttl
	monoNotificationconf.sessionKey = monoNotificationconf.sessionKey || 'userId'
	// Update mono conf reference (used for init.js)
	conf.mono.notifications = monoNotificationconf

	const Notifications = require('./service')

	// Expose add function
	module.exports.add = Notifications.add
	// Export list function
	module.exports.list = Notifications.list
	// Export read function
	module.exports.read = Notifications.read
	// Export count function
	module.exports.count = Notifications.count
	//Collection name
	module.exports.collectionName = conf.collectionName
}
