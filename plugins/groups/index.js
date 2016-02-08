'use strict'

const Joi  = require('joi')
const Boom = require('boom')
const Group = require('../../lib/group')

const groupSchema = {
	name: Joi.string().required(),
	parentId: Joi.string().guid().optional()
}

exports.register = (server, options, next) => {

	const group = Group(server.plugins['hapi-mongodb'].db.collection('groups'))

	server.route([
		{
			path: '/groups',
			method: 'get',
			config: {
				handler: (request, reply) => reply(group.get()),
				tags: ['api']
			}
		},
		{
			path: '/groups',
			method: 'post',
			config: {
				handler: (request, reply) => reply(group.add(request.payload)).code(201),
				validate: {
					payload: groupSchema
				},
				tags: ['api']
			}
		},
		{
			path: '/groups/{id}',
			method: 'get',
			config: {
				handler: (request, reply) => reply(group.get(request.params.id)),
				validate: {
					params: {
						id: Joi.string().guid().required()
					}
				},
				tags: ['api']
			}
		},
		{
			path: '/groups/{id}',
			method: 'put',
			config: {
				handler: (request, reply) => reply(group.edit(request.payload)),
				validate: {
					params: {
						id: Joi.string().guid().required()
					},
					payload: Object.assign(
						{},
						groupSchema,
						{ id: Joi.string().required() }
					)
				},
				tags: ['api']
			}
		},
		{
			path: '/groups/{id}',
			method: 'delete',
			config: {
				handler: (request, reply) => reply(group.remove(request.params.id).then(removed => removed ? null : Boom.notFound())).code(204),
				validate: {
					params: {
						id: Joi.string().guid().required()
					}
				},
				tags: ['api']
			}
		}
	])

	next()

}

exports.register.attributes = {
	name: 'Groups',
	version: '1.0.0'
};
