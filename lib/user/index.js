'use strict'

// User CRUD/domain object

const uuid = require('node-uuid')

let col

module.exports = function (collection) {
	col = collection
	return {
		get: get,
		add: add,
		edit: edit,
		remove: remove
	}
}

function mapFromCollection({_id, firstName, lastName, email}) {
	return {id: _id, firstName, lastName, email}
}

function mapForCollection({id, firstName, lastName, email}) {
	return { _id: id, firstName, lastName, email }
}

function get(id) {
	if (id) {
		return col.findOne({ _id: id }).then(mapFromCollection)
	}
	return col.find({}).toArray().then(users => users.map(mapFromCollection))
}

function add(user) {
	user._id = uuid.v4()
	return col.insert(user).then(result => mapFromCollection(result.ops[0]))
}

function edit(user) {
	return col
		.save(mapForCollection(user))
		.then(() => get(user.id))
		.catch(err => {
			console.log("Error saving user:", err)
			throw err
		})
}

function remove(id) {
	return col.remove({ _id: id }).then(result => {
		return result.result.n === 1
	})
}
