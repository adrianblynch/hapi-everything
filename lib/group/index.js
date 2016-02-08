'use strict'

// Group CRUD/domain object

const uuid = require('node-uuid')

const config = require('../../config')
const graph = require('./graph')

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

function add(group) {
	group.id = uuid.v4()
	return col
		.insert({ _id: group.id, name: group.name, parentId: group.parentId }) // Insert into collection with `_id` rather than `id`
		.then(() => graph.add(group))
		.then(() => group)
		.catch(err => {
			console.log(err)
			throw err
		})
}

function edit(group) {
	return col.save(group).then(() => get(group._id))
}

function remove(id) {
	return graph.remove(id)
		.then(removed => col.remove({ _id: id }))
		.then(deleteFilter)
		.catch(err => {
			console.log(err)
			throw err
		})
}

function deleteFilter(result) {
	return result.result.n === 1
}
