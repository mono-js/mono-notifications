const Joi = require('joi')
const { findValidation } = require('mono-mongodb')

exports.getNotifications = {
	query: Joi.object().keys({
		markRead: Joi.boolean().optional().default(false),
		limit: findValidation.limit,
		offset: findValidation.offset
	})
}

exports.readNotifications = {
	body: Joi.array().items(Joi.string())
}
