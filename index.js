'use strict'

const Hapi = require('hapi')

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
			handler: (request, reply) => reply([{}, {}])
		}
	},
	{
		method: 'post',
		path: '/users',
		config: {
			handler: (request, reply) => reply([{}, {}]).code(201)
		}
	},
	{
		method: 'put',
		path: '/users/{id}',
		config: {
			handler: (request, reply) => reply({})
		}
	},
	{
		method: 'delete',
		path: '/users/{id}',
		config: {
			handler: (request, reply) => reply().code(204)
		}
	},
	{
		method: 'get',
		path: '/load',
		config: {
			handler: (request, reply) => {
				const db = request.server.plugins['hapi-mongodb'].db
				const col = db.collection('users')
				const users = require('./users.json')
				col.insertMany(users)
				reply(col.find({}).toArray())
			}
		}
	}
])
