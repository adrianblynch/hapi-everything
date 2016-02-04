'use strict'

const Hapi = require('hapi')
const Joi = require('joi')
const Boom = require('boom')
const uuid = require('node-uuid')

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

// TEMP: A user namespace in lew of a user module
const user = {
	schema:{
		firstName: Joi.string().required(),
		lastName: Joi.string().required(),
		email: Joi.string().email().required()
	}
}

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
				col.insert(request.payload, (err, result) => {
					if (err) {
						return reply(err)
					}
					reply(result.ops[0]).code(201)
				})
			},
			validate: {
				payload: user.schema
			},
			tags: ['api']
		}
	},
	{
		method: 'put',
		path: '/users/{id}',
		config: {
			pre: [(request, reply) => {
				if (request.params.id !== request.payload._id) {
					return reply(Boom.conflict())
				}
				reply()
			}],
			handler: (request, reply) => {
				const col = request.server.plugins['hapi-mongodb'].db.collection('users')
				col.save(request.payload, (err, results) => {
					if (err) {
						return reply(err)
					}
					// TEMP: Get the document and return it
					col.findOne({_id: request.payload._id}, (err, doc) => {
						if (err) {
							return reply(err)
						}
						reply(doc).code(200)
					})
				})
			},
			validate: {
				params: {
					id: Joi.string().required()
				},
				payload: Object.assign(
					{},
					user.schema,
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
