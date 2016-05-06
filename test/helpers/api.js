// Helpers for tests
// Loaded and made available for all test files

const request = require('request-promise')

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
	getUsers: () => request({ url: `${BASE_URL}/users`, json: true }),
	addUser: user => request({
		method: 'post',
		url: `${BASE_URL}/users`,
		json: {
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email
		}
	}),
	deleteUser: user => request({ method: 'delete', url: `${BASE_URL}/users/${user.id}` })
}
