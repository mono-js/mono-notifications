const { join } = require('path')

module.exports = {
	mono: {
		modules: [
			'mono-mongodb',
			join(__dirname, '../../../..')
		],
		mongodb: {
			url: 'mongodb://localhost:27017/custom-mono-notifications',
			dropDatabase: true
		},
		notifications: {
			ttl: 1000,
			collectionName: 'custom-mono-notifications',
			routeName: 'custom-route-name'
		}
	}
}
