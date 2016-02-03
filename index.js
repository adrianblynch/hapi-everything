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
		}
	],
	(err) => {

	if (err) {
		console.log('Failed to register one or more plugins');
		throw err;
	}

	server.start(err => {

		if (err) {
			console.log('Failed to start the server')
			throw err
		}

		console.log('Server running at:', server.info.uri)

	})
})

server.route({
	method: 'get',
	path: '/',
	config: {
		handler: (request, reply) => reply({up: "and", running: "!"}),
		tags: ['api']
	}
})
