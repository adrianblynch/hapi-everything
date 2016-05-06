import test from 'ava'
import api from './helpers/api'

const context = {} // TODO: See if there's a better way - beforeEach gives us t.context, this is to keep things consistent - Though some might say confusing

test.before(async t => {

	const groups = [
		{name: 'Group to get'},
		{name: 'Group to update'},
		{name: 'Group to delete'}
	]

	context.groups = await Promise.all(groups.map(api.addGroup))

})

test.after(async t => {
	await Promise.all(context.groups.map(api.deleteGroup)).catch(err => err) // Ignore any errors - Why? - Because we may have deleted a group already
})

test('GET /groups', async t => {

	const groups = await api.getGroups()
	const groupIds = groups.map(g => g.id)
	const expectedGroupIds = context.groups.map(g => g.id)

	expectedGroupIds.forEach(id => t.true(groupIds.includes(id)))

})

test('GET /groups/:id', async t => {

	const groupToGet = context.groups[0]
	const group = await api.getGroup(groupToGet)

	t.is(group.id, groupToGet.id)

})

test('POST /groups', async t => {

	const groupToAdd = {name: 'A new group'}
	const group = await api.addGroup(groupToAdd)

	t.is(group.name, groupToAdd.name)

	context.groups.push(group) // Tidy up

})

test('PUT /groups', async t => {

	const name = 'Updated name'
	const groupToUpdate = Object.assign({}, context.groups[1], {name})
	const updatedGroup = await api.updateGroup(groupToUpdate)

	t.is(updatedGroup.name, groupToUpdate.name)

})

test('DELETE /groups/:id', async t => {

	const groupToDelete = context.groups[2]
	const deletedGroup = await api.deleteGroup(groupToDelete)

	t.is(deletedGroup, '')

})
