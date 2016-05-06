import test from 'ava'
import request from 'request-promise'

const BASE_URL = 'http://localhost:8000'

// TODO: Use `resolveWithFullResponse: true` to get back the full response for status code and header checks
const getGroups = () => request({ url: `${BASE_URL}/groups`, json: true })
const getGroup = id => request({ url: `${BASE_URL}/groups/${id}`, json: true })
const addGroup = group => request({
	method: 'post',
	url: `${BASE_URL}/groups`,
	json: {
		name: group.name,
		parentId: group.parentId
	}
})
const updateGroup = group => request({
	method: 'put',
	url: `${BASE_URL}/groups/${group.id}`,
	json: {
		id: group.id,
		name: group.name,
		parentId: group.parentId
	}
})
const deleteGroup = id => request({ method: 'delete', url: `${BASE_URL}/groups/${id}` })

const context = {} // TODO: See if there's a better way

test.before(async t => {

	const groups = [
		{name: 'Test Group 1'},
		{name: 'Test Group 2'}
	]

	context.groups = await Promise.all(groups.map(addGroup))

})

test('GET /groups', async t => {

	const groups = await getGroups()
	const groupIds = groups.map(g => g.id)
	const expectedGroupIds = context.groups.map(g => g.id)

	expectedGroupIds.forEach(id => t.true(groupIds.includes(id)))

})

test('GET /groups/:id', async t => {

	const groupId = context.groups[0].id
	const group = await getGroup(groupId)

	t.is(group.id, groupId)

})

test.after(async t => {
	await Promise.all(context.groups.map(group => deleteGroup(group.id)))
})
