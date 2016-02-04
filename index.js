'use strict'

const Hapi = require('hapi')
const Joi = require('joi')
const Boom = require('boom')

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

		console.log('Server running at:', server.info.uri)

	})
})

// TODO: Break user domain objects from Hapi routing
server.route([
	{
		method: 'get',
		path: '/users',
		config: {
			handler: (request, reply) => {
				const col = request.server.plugins['hapi-mongodb'].db.collection('users')
				return reply(col.find({}).limit(10).toArray())
			},
			tags: ['api']
		}
	},
	{
		method: 'post',
		path: '/users',
		config: {
			handler: (request, reply) => {
				const col = request.server.plugins['hapi-mongodb'].db.collection('users')
				col.insert(request.payload, (err, results) => {
					if (err) {
						return reply(err)
					}
					reply(results.ops.map(item => {
						return {
							id: item.id,
							firstName: item.firstName,
							lastName: item.lastName,
							email: item.email
						}
					})).code(201)
				})
			},
			validate: {
				payload: {
					id: Joi.string().required(),
					firstName: Joi.string().required(),
					lastName: Joi.string().required(),
					email: Joi.string().email().required()
				}
			},
			tags: ['api']
		}
	},
	{
		method: 'put',
		path: '/users/{id}',
		config: {
			handler: (request, reply) => reply(Boom.notImplemented()),
			tags: ['api']
		}
	},
	{
		method: 'delete',
		path: '/users/{id}',
		config: {
			handler: (request, reply) => reply(Boom.notImplemented()),
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
				const db = request.server.plugins['hapi-mongodb'].db
				const col = db.collection('users')
				const users = require('./users.json')
				col.insertMany(users)
				return reply()
			},
			tags: ['api']
		}
	}
])
