
/*
	Note: This is more about learning Material UI, so all components are in this file
*/

import React from 'react'

import {deepOrange500} from 'material-ui/styles/colors'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import {AppBar, IconMenu, MenuItem, IconButton, MoreVertIcon} from 'material-ui'

const muiTheme = getMuiTheme()

class App extends React.Component {

	constructor() {
		super()
		this.state = {
			users: []
		}
		fetch('http://localhost:8000/users')
			.then(response => response.json())
			.then(response => {
				this.setState({users: response})
			})
	}

	render() {
		console.log("STATE:", this.state.users)
		return (
			<MuiThemeProvider muiTheme={muiTheme}>
				<div>
					<AppBar title="React Material UI" />
					<UserList users={this.state.users} />
				</div>
			</MuiThemeProvider>
		)
	}

}

class UserList extends React.Component {

	constructor() {
		super()
	}

	render() {
		return (
			<table>
				<thead>
					<tr>
						<th>ID</th>
						<th>First name</th>
						<th>Last name</th>
						<th>Email</th>
					</tr>
				</thead>
				<tbody>
					{this.props.users.map((user, i) => <UserListItem key={i} user={user} />)}
				</tbody>
			</table>
		)
	}

}

class UserListItem extends React.Component {

	render() {
		const {id, firstName, lastName, email} = this.props.user
		return (
			<tr>
				<td>{id}</td>
				<td>{firstName}</td>
				<td>{lastName}</td>
				<td>{email}</td>
			</tr>
		)
	}

}

export default App
