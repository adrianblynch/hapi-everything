'use strict';

const Joi  = require('joi')
const Boom = require('boom')
const redis = require('redis')
const User = require('../../lib/user')

const baseUserSchema = {
	firstName: Joi.string().required(),
	lastName: Joi.string().required(),
	email: Joi.string().email().required()
}
const redisClient = redis.createClient()

const ALL_USERS_KEY = 'allUsers'
const ALL_USERS_TTL = 5

redisClient.on('error', err => console.log('Redis error', err))

exports.register = (server, options, next) => {

	const user = User(server.plugins['hapi-mongodb'].db.collection('users'))

	server.route(
		[
			{
				method: 'get',
				path: '/users',
				config: {
					// NOTE: Inline for now, just to check Redis/caching is working...
					pre: [
						(request, reply) => {
							console.log(request.query)
							if (!request.query.noCache) {
								redisClient.get(ALL_USERS_KEY, (err, result) => {
									if (err) {
										console.log('Error looking for [users] in cache. Continue anyway...', err)
									}
									if (result) {
										console.log('Found [users] in cache')
										request.pre.users = result
									} else {
										console.log('No [users] found in cache')
									}
									reply()
								})
							} else {
								reply()
							}
						}
					],
					handler: (request, reply) => {

						if (request.pre.users) {
							reply(JSON.parse(request.pre.users))
						} else {
							user.get()
								.then(users => {
									reply(users)
									return users
								})
								.then(users => {
									console.log('Adding [users] to cache')
									redisClient.set(ALL_USERS_KEY, JSON.stringify(users))
									redisClient.expire(ALL_USERS_KEY, ALL_USERS_TTL)
								})
						}

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
			{
				method: 'delete',
				path: '/users',
				config: {
					handler: (request, reply) => reply(user.removeAll()).code(204),
					tags: ['api']
				}
			}
		]
	)

	next()

};

exports.register.attributes = {
	name: 'Users',
	version: '1.0.0'
};
