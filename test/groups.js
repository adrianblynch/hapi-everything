import test from 'ava'
import api from './helpers/api'

// TODO: See if there's a better way - beforeEach gives us t.context, this is to keep things consistent - Though some might say confusing
const context = {
	groups: []
}

test.after(async t => {
	await Promise.all(context.groups.map(api.deleteGroup))
})

test('GET /groups', async t => {

	const expectedGroups = await Promise.all([api.addGroup(), api.addGroup(), api.addGroup()])
	const expectedGroupIds = expectedGroups.map(g => g.id)

	const allGroups = await api.getGroups()
	const allGroupIds = allGroups.map(g => g.id)

	expectedGroupIds.forEach(id => t.true(allGroupIds.includes(id)))

	context.groups.push(...expectedGroups)

})

test('GET /groups/:id', async t => {

	const groupToGet = await api.addGroup()
	const group = await api.getGroup(groupToGet)

	t.is(group.id, groupToGet.id)

	context.groups.push(groupToGet)

})

test('POST /groups', async t => {

	const groupToAdd = api.makeGroup()
	const addedGroup = await api.addGroup(groupToAdd)

	t.is(addedGroup.name, groupToAdd.name)

	context.groups.push(addedGroup)

})

test('PUT /groups', async t => {

	const groupToUpdate = await api.addGroup()

	Object.assign(groupToUpdate, {name: 'Updated name'})

	const updatedGroup = await api.updateGroup(groupToUpdate)

	t.is(updatedGroup.name, groupToUpdate.name)

	context.groups.push(updatedGroup)

})

test('DELETE /groups/:id', async t => {

	const groupToDelete = await api.addGroup()
	const deletedGroup = await api.deleteGroup(groupToDelete)

	t.is(deletedGroup, '')

})
