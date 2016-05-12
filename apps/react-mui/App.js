
/*
	Note: This is more about learning Material UI, so all components are in this file
*/

import React from 'react'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import {deepOrange500} from 'material-ui/styles/colors'
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table'
import { AppBar, RaisedButton, FlatButton, Popover, MenuItem, Menu, Dialog, TextField } from 'material-ui'
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar'
import FontIcon from 'material-ui/FontIcon'

const muiTheme = getMuiTheme()

class App extends React.Component {

	constructor() {
		super()
		this.state = {
			users: [],
			selectedUsers: 'none',
			showAddUser: false
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

	toggleAddUser() {
		this.setState({showAddUser: !this.state.showAddUser})
	}

	render() {
		return (
			<MuiThemeProvider muiTheme={muiTheme}>
				<div>
					<AppBar title="React Material UI" />
					<ActionsBar
						deleteSelectedUsers={this.deleteSelectedUsers.bind(this)}
						showAddUser={this.toggleAddUser.bind(this)}
					/>
					{
						this.state.showAddUser ?
						<UserForm /> :
						<UserList users={this.state.users} usersSelected={this.markUsersSelected.bind(this)} />
					}
				</div>
			</MuiThemeProvider>
		)
	}

}

class ConfirmUserDelete extends React.Component {
	constructor(props) {
		console.log("ConfirmUserDelete constructed", props)
		super(props)
		this.state = {
			userCount: 0,
			open: props.open
		}
	}
	onConfirm() {
		this.props.onConfirm()
	}
	onCancel() {
		this.setState({open: false})
	}
	render() {
		console.log("ConfirmUserDelete rendered", this.props)

		const {userCount} = this.props
		const actions = [
			<FlatButton
				label="Cancel"
				primary={true}
				onTouchTap={this.onCancel.bind(this)}
			/>,
			<FlatButton
				label="Delete"
				primary={true}
				onTouchTap={this.onConfirm.bind(this)}
			/>
		];
		return (
			<Dialog
				actions={actions}
				modal={false}
				open={this.state.open}
				onRequestClose={this.handleClose}
			>Delete selected users?</Dialog>
		)
	}
}

class ActionsBar extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			confirmUserDeleteOpen: false,
			deleteUsersActive: true
		}
	}

	handleDeleteUsers() {
		this.setState({confirmUserDeleteOpen: true})
	}

	handlerDeleteUsersConfirmation() {
		this.props.deleteSelectedUsers()
		this.setState({confirmUserDeleteOpen: false})
	}

	handlerDeleteUsersCancel() {
		this.setState({confirmUserDeleteOpen: false})
	}

	handleAddUser() {
		this.props.showAddUser()
		this.setState({deleteUsersActive: false})
	}

	render() {

		const userDeleteActions = [
			<FlatButton label="Cancel" onClick={this.handlerDeleteUsersCancel.bind(this)} />,
			<FlatButton label="Delete" onClick={this.handlerDeleteUsersConfirmation.bind(this)} />
		]

		return (
			<Toolbar>
				<ToolbarGroup firstChild={true}>
					<RaisedButton
						label="Delete selected users"
						primary={true}
						onClick={this.handleDeleteUsers.bind(this)}
						icon={<FontIcon className="muidocs-icon-custom-github" />}
						disabled={!this.state.deleteUsersActive}
					/>
					<Dialog
						open={this.state.confirmUserDeleteOpen}
						actions={userDeleteActions}
					>Delete selected users?</Dialog>
					// <RaisedButton
					// 	label="Add new user"
					// 	primary={true}
					// 	onClick={this.handleAddUser.bind(this)}
					// 	icon={<FontIcon className="muidocs-icon-custom-github" />}
					// />
				</ToolbarGroup>
			</Toolbar>
		)
	}
}

class UserList extends React.Component {

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

class UserForm extends React.Component {
	render() {
		return (
			<form>
				<TextField floatingLabelText="First name" />
				<TextField floatingLabelText="Last name" />
				<TextField floatingLabelText="Email" />
			</form>
		)
	}
}

export default App
