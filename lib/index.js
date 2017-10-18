const ms = require('ms')

module.exports = function () {
	// Default configuration
	const conf = this.conf.mono.notifications || {}
	conf.collectionName = conf.collectionName || 'mono-notifications'
	conf.routeName = conf.routeName || 'notifications'
	conf.ttl = conf.ttl || '30 days'
	conf.ttl = (typeof conf.ttl === 'string') ? ms(conf.ttl) : conf.ttl
	// Update mono conf reference (used for init.js)
	this.conf.mono.notifications = conf

	const Notifications = require('./services')

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
