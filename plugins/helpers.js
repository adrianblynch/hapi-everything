'use strict'

const Boom = require('boom')

module.exports = () => {
	return {
		paramAndPayloadIdMatch: paramAndPayloadIdMatch
	}
}

function paramAndPayloadIdMatch(request, reply) {
	if (request.params.id !== request.payload._id) {
		return reply(Boom.conflict())
	}
	reply()
}
