'use strict'

const Hapi = require('hapi')
const Boom = require('boom')
const uuid = require('node-uuid')

const config = require('./config')

const server = new Hapi.Server()

server.connection({
	host: 'localhost',
	port: 8000
})

const goodOptions = {
	reporters: [
		{
			reporter: require('good-console'),
			events: {
				log: '*',
				response: '*'
			}
		},
		{
			reporter: require('good-loggly'),
			events: {
				log: '*',
				response: '*'
			},
			config: {
				token: config.loggly.token,
				subdomain: config.loggly.subdomain,
				name: 'hapi-everything',
				tags: ['api']
			}
		}
	]
}
const mongoDbOptions = { url: 'mongodb://localhost:27017/everything' }
const swaggerOptions = { info: { 'title': 'Hapi Everything API Documentation' }, documentationPath: '/' }

server.register(
	[
		{ register: require('inert') },
		{ register: require('vision') },
		{ register: require('hapi-swagger'), options: swaggerOptions },
		{ register: require('hapi-mongodb'), options: mongoDbOptions },
		{ register: require('good'), options: goodOptions},
		{ register: require('./plugins/users'), options: {} },
		{ register: require('./plugins/groups'), options: {} }
	],
	err => {
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
	}
)

server.method('helpers', require('./plugins/helpers'));

// TEMP: This whole route can go once the CRUD for users is in place, for now:
server.route([
	{
		method: 'get',
		path: '/load',
		config: {
			handler: (request, reply) => {
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
			}
		}
	}
])
