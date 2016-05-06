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
		remove: remove,
		removeAll: removeAll
	}
}

// TODO: mapFromCollection and mapForCollection aren't great. Is there a better way to map the IDs?

function mapFromCollection(group) {
	return { id: group._id, name: group.name, parentId: group.parentId }
}

function mapForCollection(group) {
	return { _id: group.id, name: group.name, parentId: group.parentId }
}

function get(id) {
	if (id) {
		return col.findOne({ _id: id }).then(mapFromCollection)
	}
	return col.find({}).toArray().then(results => results.map(mapFromCollection))
}

function add(group) {
	group.id = uuid.v4()
	return col
		.insert(mapForCollection(group))
		.then(() => graph.add(group))
		.then(() => group)
		.catch(err => {
			console.log(err)
			throw err
		})
}

function edit(group) {
	return col
		.save(mapForCollection(group))
		.then(() => graph.edit(group))
		.then(() => get(group._id))
		.then(() => group)
		.catch(err => {
			console.log(err)
			throw err
		})
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

function removeAll(id) {
	return graph.removeAll()
		.then(removed => col.remove({}))
		.then(deleteFilter)
		.catch(err => {
			console.log(err)
			throw err
		})
}

function deleteFilter(result) {
	return result.result.n === 1
}
