'use strict'

const Orient = require('orientjs')

const config = require('../../config')

const orientServer = Orient({
	host: 'localhost',
	port: 2424,
	username: config.orientDb.username,
	password: config.orientDb.password
})
const db = orientServer.use('everything')

module.exports = {
	add: add,
	edit: edit,
	remove: remove,
	removeAll: removeAll
}

function add(group) {

	if (group.parentId) {
		return addAndLink(group)
	}

	return db
		.insert()
		.into('Group')
		.set(group)
		.one()
		.catch(err => {
			console.log(err)
			throw err
		})

}

function addAndLink(group) {

	// TODO: If parent group doesn't exist, an exception is thrown - Deal with it

	return db
		.exec(
			`BEGIN
				LET group = CREATE VERTEX Group SET id = '${group.id}', name = '${group.name}'
				LET edge = CREATE EDGE BelongsTo FROM $group TO (SELECT FROM Group WHERE id = '${group.parentId}')
			COMMIT
			RETURN $group`
			, { class: "s" } // TODO: Find out why this is needed for batch statements and why I can't use named params at the same time
		)
		.catch(err => {
			console.log(err)
			throw err
		})

}

function edit(group) {
	return db
		.update('Group')
		.set(group)
		.where({ id: group.id })
		.scalar()
		.catch(err => {
			console.log(err)
			throw err
		});
}

function remove(id) {
	return db
		.query(
			'DELETE VERTEX Group WHERE id = :id',
			{ params: { id: id } }
		)
		.then(result => result[0] === '1')
		.catch(err => {
			console.log(err)
			throw err
		})
}

function removeAll() {
	return db
		.query(
			'DELETE VERTEX Group'
		)
		.then(result => {console.log(result); return result;})
		.then(result => result[0] === '1')
		.catch(err => {
			console.log(err)
			throw err
		})
}
