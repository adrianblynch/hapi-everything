'use strict';

const Joi  = require('joi')
const Boom = require('boom')
const User = require('../../lib/user')

const baseUserSchema = {
	firstName: Joi.string().required(),
	lastName: Joi.string().required(),
	email: Joi.string().email().required()
}

exports.register = (server, options, next) => {

	const user = User(server.plugins['hapi-mongodb'].db.collection('users'))

	server.route(
		[
			{
				method: 'get',
				path: '/users',
				config: {
					handler: (request, reply) => {
						reply(user.get())
					},
					tags: ['api']
				}
			},
			{
				method: 'get',
				path: '/users/{id}',
				config: {
					handler: (request, reply) => {
						reply(user.get(request.params.id).then(doc => {
							return doc || Boom.notFound()
						}))
					},
					validate: {
						params: {
							id: Joi.string().guid().required()
						}
					},
					tags: ['api']
				}
			},
			{
				method: 'post',
				path: '/users',
				config: {
					handler: (request, reply) => reply(user.add(request.payload)).code(201),
					validate: {
						payload: baseUserSchema
					},
					tags: ['api']
				}
			},
			{
				method: 'put',
				path: '/users/{id}',
				config: {
					pre: [
						server.methods.helpers().paramAndPayloadIdMatch
					],
					handler: (request, reply) => reply(user.edit(request.payload)),
					validate: {
						params: {
							id: Joi.string().guid().required()
						},
						payload: Object.assign(
							{},
							baseUserSchema,
							{
								id: Joi.string().guid().required()
							}
						)
					},
					tags: ['api']
				}
			},
			{
				method: 'delete',
				path: '/users/{id}',
				config: {
					handler: (request, reply) => reply(user.remove(request.params.id).then(removed => removed ? null : Boom.notFound())).code(204),
					validate: {
						params: {
							id: Joi.string().guid().required()
						}
					},
					tags: ['api']
				}
			},
		]
	)

	next()

};

exports.register.attributes = {
	name: 'Users',
	version: '1.0.0'
};
