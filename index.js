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
				}
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

// Temp routes for now
server.route([
	{
		method: 'get',
		path: '/',
		config: {
			handler: (request, reply) => reply({up: "and", running: "!"}),
			tags: ['api']
		}
	},
	{
		method: 'get',
		path: '/load',
		config: {
			handler: (request, reply) => {
				const db = request.server.plugins['hapi-mongodb'].db
				const col = db.collection('users');
				reply(col.find({}).toArray())
			}
		}
	}
])
