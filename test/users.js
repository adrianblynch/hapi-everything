import test from 'ava'
import api from './helpers/api'

const context = {
	users: []
}

test.after(async t => {
	await Promise.all(context.users.map(api.deleteUser))
})

test('GET /users', async t => {

	// Create some users
	let usersToAdd = [api.makeUser(), api.makeUser(), api.makeUser()]
	usersToAdd = await Promise.all(usersToAdd.map(api.addUser))

	// Get all users and look for the newly created users in amongst them
	const allUsers = await api.getUsers()
	const allUserIds = allUsers.map(g => g.id)
	const expectedUserIds = usersToAdd.map(u => u.id)

	expectedUserIds.forEach(id => t.true(allUserIds.includes(id)))

	// Store new users for clean-up
	context.users.push(...usersToAdd)

})

test('GET /users/:id', async t => {

	const userToGet = await api.addUser(api.makeUser())
	const user = await api.getUser(userToGet)

	t.is(user.id, userToGet.id)

	context.users.push(userToGet)

})

test('POST /users', async t => {

	const userToAdd = api.makeUser()
	const addedUser = await api.addUser(userToAdd)

	t.is(addedUser.firstName, userToAdd.firstName)
	t.is(addedUser.lastName, userToAdd.lastName)
	t.is(addedUser.email, userToAdd.email)

	context.users.push(addedUser)

})

test('PUT /users/:id', async t => {

	const userToUpdate = await api.addUser(api.makeUser())

	Object.assign(userToUpdate, {
		firstName: 'Updated first name',
		lastName: 'Updated last name',
		email: 'updated@email.address'
	})

	const updatedUser = await api.updateUser(userToUpdate)

	t.is(updatedUser.firstName, userToUpdate.firstName)
	t.is(updatedUser.lastName, userToUpdate.lastName)
	t.is(updatedUser.email, userToUpdate.email)

	context.users.push(updatedUser)

})

test('DELETE /users/:id', async t => {

	const userToDelete = await api.addUser(api.makeUser())
	const deletedUser = await api.deleteUser(userToDelete)

	t.is(deletedUser, '')

})
