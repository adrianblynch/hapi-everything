// Helpers for tests - A bit of a dumping ground at the moment - Could do with some consolidation
// ES5 unil I transpile myself or this gets implemented: https://github.com/sindresorhus/ava/issues/720

const request = require('request-promise')
const uuid = require('node-uuid')

const BASE_URL = 'http://localhost:8000'

// TODO: Use `resolveWithFullResponse: true` to get back the full response for status code and header checks
module.exports = {

	// Groups
	getGroups: () => request({ url: `${BASE_URL}/groups`, json: true }),
	getGroup: group => request({ url: `${BASE_URL}/groups/${group.id}`, json: true }),
	addGroup: group => request({
		method: 'post',
		url: `${BASE_URL}/groups`,
		json: {
			name: group.name,
			parentId: group.parentId
		}
	}),
	updateGroup: group => request({
		method: 'put',
		url: `${BASE_URL}/groups/${group.id}`,
		json: {
			id: group.id,
			name: group.name,
			parentId: group.parentId
		}
	}),
	deleteGroup: group => request({ method: 'delete', url: `${BASE_URL}/groups/${group.id}` }),

	// Users

	makeUser: (user) => {
		return Object.assign(
			{},
			{
				firstName: uuid.v4(),
				lastName: uuid.v4(),
				email: `${uuid.v4()}@email.com`
			},
			user
		)
	},

	getUsers: () => request({ url: `${BASE_URL}/users`, json: true }),
	getUser: user => request({ url: `${BASE_URL}/users/${user.id}`, json: true }),
	addUser: user => request({
		method: 'post',
		url: `${BASE_URL}/users`,
		json: {
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email
		}
	}),
	updateUser: user => request({
		method: 'put',
		url: `${BASE_URL}/users/${user.id}`,
		json: {
			id: user.id,
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email
		}
	}),
	deleteUser: user => request({ method: 'delete', url: `${BASE_URL}/users/${user.id}` })
}
