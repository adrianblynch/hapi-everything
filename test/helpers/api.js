// Helpers for tests - A bit of a dumping ground at the moment - Could do with some consolidation
// NOTE: Not as much ES6 goodness until I transpile myself or this gets implemented: https://github.com/sindresorhus/ava/issues/720
// TODO: Use `resolveWithFullResponse: true` to get back the full response for status code and header checks

const request = require('request-promise')
const uuid = require('node-uuid')

const BASE_URL = 'http://localhost:8000'

////////////
// Groups //
////////////

function makeGroup(group) {
	return Object.assign({name: uuid.v4()}, group)
}

function getGroups() {
	return request({ url: `${BASE_URL}/groups`, json: true })
}

function getGroup(group) {
	return request({ url: `${BASE_URL}/groups/${group.id}`, json: true })
}

function addGroup(group = makeGroup()) {
	return request({
		method: 'post',
		url: `${BASE_URL}/groups`,
		json: {
			name: group.name,
			parentId: group.parentId
		}
	})
}

function updateGroup(group) {
	return request({
		method: 'put',
		url: `${BASE_URL}/groups/${group.id}`,
		json: {
			id: group.id,
			name: group.name,
			parentId: group.parentId
		}
	})
}

function deleteGroup(group) {
	return request({ method: 'delete', url: `${BASE_URL}/groups/${group.id}` })
}

///////////
// Users //
///////////

function makeUser(user) {
	return Object.assign(
		{
			firstName: uuid.v4(),
			lastName: uuid.v4(),
			email: `${uuid.v4()}@email.com`
		},
		user
	)
}

function getUsers() {
	return request({ url: `${BASE_URL}/users`, json: true })
}

function getUser(user) {
	return request({ url: `${BASE_URL}/users/${user.id}`, json: true })
}

function addUser(user = makeUser()) {
	return request({
		method: 'post',
		url: `${BASE_URL}/users`,
		json: {
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email
		}
	})
}

function updateUser(user) {
	return request({
		method: 'put',
		url: `${BASE_URL}/users/${user.id}`,
		json: {
			id: user.id,
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email
		}
	})
}

function deleteUser(user) {
	return request({ method: 'delete', url: `${BASE_URL}/users/${user.id}` })
}

module.exports = {

	makeGroup: makeGroup,
	getGroups: getGroups,
	getGroup: getGroup,
	addGroup: addGroup,
	updateGroup: updateGroup,
	deleteGroup: deleteGroup,

	makeUser: makeUser,
	getUsers: getUsers,
	getUser: getUser,
	addUser: addUser,
	updateUser: updateUser,
	deleteUser: deleteUser

}
