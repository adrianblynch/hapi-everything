'use strict'

const Hapi = require('hapi')

const server = new Hapi.Server()

server.connection({
	host: 'localhost',
	port: 8000
})

server.route({
	method: 'get',
	path: '/',
	handler: (request, reply) => reply({up: "and", running: "!"})
})

server.start(err => {
	if (err) {
		console.log('Failed to start the server')
		throw err
	}
	console.log('Server running at:', server.info.uri)
})
