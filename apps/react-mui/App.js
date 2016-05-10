
/*
	Note: This is more about learning Material UI, so all components are in this file
*/

import React from 'react'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import {deepOrange500} from 'material-ui/styles/colors'
import {AppBar} from 'material-ui'
import {
	Table,
	TableBody,
	TableHeader,
	TableHeaderColumn,
	TableRow,
	TableRowColumn
} from 'material-ui/Table'
import {RaisedButton, Popover, MenuItem, Menu} from 'material-ui'

const muiTheme = getMuiTheme()

class App extends React.Component {

	constructor() {
		super()
		this.state = {
			users: [],
			selectedUsers: 'none'
		}
		fetch('http://localhost:3838/users')
		.then(response => response.json())
		.then(response => {
			this.setState({users: response})
		})
	}

	markUsersSelected(selection) {
		// this.setState({selectedUsers: selection}) // Wipes the selected users in the Table component
		this.state.selectedUsers = selection // Leaves the users in place - Find out how to do this better
	}

	deleteSelectedUsers() {

		const {selectedUsers, users} = this.state
		const usersToDelete = users.filter((user, index) => {
			return selectedUsers === 'all' || (Array.isArray(selectedUsers) && selectedUsers.includes(index))
		})

		// Optimistically requesting to delete users

		Promise.all(usersToDelete.map(user =>
			fetch(`http://localhost:3838/users/${user.id}`, {method: 'DELETE'})
			.catch(err => console.log("Failed to delete user", user, err))
		))
		.then(responses => {
			const remainingUsers = users.filter(user => !usersToDelete.includes(user))
			this.setState({users: remainingUsers})
		})

	}

	render() {
		return (
			<MuiThemeProvider muiTheme={muiTheme}>
				<div>
					<AppBar title="React Material UI" />
					<ActionsBar active={true} deleteSelectedUsers={this.deleteSelectedUsers.bind(this)} />
					<UserList users={this.state.users} usersSelected={this.markUsersSelected.bind(this)} />
				</div>
			</MuiThemeProvider>
		)
	}

}

class ActionsBar extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			open: false
		}
		this.handleTouchTap = this.handleTouchTap.bind(this)
		this.handleRequestClose = this.handleRequestClose.bind(this)
		this.handleDeleteClick = this.handleDeleteClick.bind(this)
	}

	handleTouchTap(event) {
		event.preventDefault()
		this.setState({
			open: true,
			anchorEl: event.currentTarget
		})
	}

	handleRequestClose() {
		this.setState({
			open: false,
			anchorEl: null
		})
	}

	handleDeleteClick(event) {
		console.log("Delete selected users")
		this.props.deleteSelectedUsers()
	}

	render() {
		return (
			<div>
				<RaisedButton label="Actions" onClick={this.handleTouchTap} disabled={!this.props.active} />
				<Popover open={this.state.open} anchorEl={this.state.anchorEl} onRequestClose={this.handleRequestClose}>
					<Menu>
						<MenuItem primaryText="Delete" onClick={this.props.deleteSelectedUsers} />
					</Menu>
				</Popover>
			</div>
		)
	}
}

class UserList extends React.Component {

	constructor(props) {
		super(props)
	}

	render() {
		return (
			<Table multiSelectable={true} onRowSelection={this.props.usersSelected.bind(this)}>
				<TableHeader>
					<TableRow>
						<TableHeaderColumn>ID</TableHeaderColumn>
						<TableHeaderColumn>First name</TableHeaderColumn>
						<TableHeaderColumn>Last name</TableHeaderColumn>
						<TableHeaderColumn>Email</TableHeaderColumn>
					</TableRow>
				</TableHeader>
				<TableBody deselectOnClickaway={false}>
					{this.props.users.map((user, i) => (
						<TableRow key={user.id}>
							<TableRowColumn>{user.id}</TableRowColumn>
							<TableRowColumn>{user.firstName}</TableRowColumn>
							<TableRowColumn>{user.lastName}</TableRowColumn>
							<TableRowColumn>{user.email}</TableRowColumn>
						</TableRow>
					))}
				</TableBody>
			</Table>
		)
	}

}

export default App
