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

function get(id) {
	if (id) {
		return col.findOne({ _id: id })
	}
	return col.find({}).limit(10).toArray()
}

function add(user) {
	user._id = uuid.v4()
	return col.insert(user).then(result => result.ops[0])
}

function edit(user) {
	return col.save(user).then(() => get(user._id))
}

function remove(id) {
	return col.remove({ _id: id }).then(result => {
		return result.result.n === 1
	})
}
