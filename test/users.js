import test from 'ava'
import api from './helpers/api'

const context = {}

test.before(async t => {

	const users = [
		{firstName: 'User', lastName: 'to add', email: 'user@to.add'},
		{firstName: 'User', lastName: 'to update', email: 'user@to.update'},
		{firstName: 'User', lastName: 'to delete', email: 'user@to.delete'}
	]

	context.users = await Promise.all(users.map(api.addUser))

})

test.after(async t => {
	await Promise.all(context.users.map(api.deleteUser))
})

test('GET /users', async t => {

	const users = await api.getUsers()
	const userIds = users.map(g => g.id)
	const expectedUserIds = context.users.map(u => u.id)

	expectedUserIds.forEach(id => t.true(userIds.includes(id)))

})
