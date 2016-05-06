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

// function mapForCollection(group) {
// 	return { _id: group.id, name: group.name, parentId: group.parentId }
// }

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
	return col.save(user).then(() => get(user._id))
}

function remove(id) {
	return col.remove({ _id: id }).then(result => {
		return result.result.n === 1
	})
}
