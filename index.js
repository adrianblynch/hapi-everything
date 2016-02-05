'use strict'

const Hapi = require('hapi')
const Joi  = require('joi')
const Boom = require('boom')
const uuid = require('node-uuid')

let user = require('./lib/user')

const server = new Hapi.Server()

server.connection({
	host: 'localhost',
	port: 8000
})

server.register(
	[
		require('inert'),
		require('vision'),
		{
			register: require('hapi-swagger'),
			options: {
				info: {
					'title': 'API Documentation - Swagger'
				},
				documentationPath: '/'
			}
		},
		{
			register: require('hapi-mongodb'),
			options: {
				url: 'mongodb://localhost:27017/everything'
			}
		}
	],
	(err) => {

	if (err) {
		console.log('Failed to register one or more plugins')
		throw err
	}

	server.start(err => {

		if (err) {
			console.log('Failed to start the server')
			throw err
		}

		user = user(server.plugins['hapi-mongodb'].db.collection('users'))

		console.log('Server running at:', server.info.uri)

	})
})

// TEMP: A user namespace in lew of a user module
const userSchema = {
	firstName: Joi.string().required(),
	lastName: Joi.string().required(),
	email: Joi.string().email().required()
}

function paramAndPayloadIdMatch(request, reply) {
	if (request.params.id !== request.payload._id) {
		return reply(Boom.conflict())
	}
	reply()
}

// TODO: Break user domain objects from Hapi routing
server.route([
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
					id: Joi.string().required()
				}
			},
			tags: ['api']
		}
	},
	{
		method: 'post',
		path: '/users',
		config: {
			handler: (request, reply) => {
				reply(user.add(request.payload)).code(201)
			},
			validate: {
				payload: userSchema
			},
			tags: ['api']
		}
	},
	{
		method: 'put',
		path: '/users/{id}',
		config: {
			pre: [paramAndPayloadIdMatch],
			handler: (request, reply) => {
				reply(user.edit(request.payload))
			},
			validate: {
				params: {
					id: Joi.string().required()
				},
				payload: Object.assign(
					{},
					userSchema,
					{ _id: Joi.string().required() }
				)
			},
			tags: ['api']
		}
	},
	{
		method: 'delete',
		path: '/users/{id}',
		config: {
			handler: (request, reply) => {
				reply(user.remove(request.params.id).then(removed => removed ? null : Boom.notFound())).code(204)
			},
			validate: {
				params: {
					id: Joi.string().required()
				}
			},
			tags: ['api']
		}
	},
	{
		method: 'get',
		path: '/load',
		config: {
			handler: (request, reply) => {
				// TEMP: This whole route can go once the CRUD for users is in place, for now:
				return reply(Boom.notImplemented())
				const col = request.server.plugins['hapi-mongodb'].db.collection('users')
				const users = require('./users.json')
				col.insertMany(users.map(user => {
					return {
						_id: uuid.v4(),
						firstName: user.firstName,
						lastName: user.lastName,
						email: user.email
					}
				}), (err, results) => {
					if (err) {
						return reply(err)
					}
					reply().code(201)
				})
			},
			tags: ['api']
		}
	}
])
