import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Dropdown } from "semantic-ui-react";


const Welcome = () => {
	return (
		<div style={{paddingTop:100+'px'}}>
			<h1 className="title is-size-2" style={{textAlign:'center'}}>Welcome to Cyobstract</h1>
		</div>
	);
}


const AddIntelgroup = (props) => {

	const [name, setName] = useState('');
  	const [description, setDescription] = useState('');
  	const [userids, setUserIds] = useState([]);

	const userOptions = props.users.map((user, index) => ({
		key: index,
		value: user.id,
		text: user.email
	}));
	return (
		<section className="section app-card">
			<h2 className="subtitle">Intel Group Details</h2>
			<div className="field">
				<label className="label">Name</label>
				<div className="control">
				<input className="input" type="text" placeholder="Name"
						onChange={(event) => setName(event.target.value)} value={name} required={true}>
				</input>
				</div>
			</div>
			<div className="field">
				<div className="control">
				<label className="label">Description</label>
				<input className="input" type="text" placeholder="Description"
						onChange={(event) => setDescription(event.target.value)} value={description} required={true}>
				</input>
				</div>
			</div>
			<div className="field">
				<div className="control">
				<label className="label">Invite Users</label>
				<Dropdown
					placeholder='Select Users'
					fluid
					multiple
					search
					selection
					options={userOptions}
					onChange={(e,{value}) => {
					setUserIds(value);
					}}
				/>
				</div>
			</div>
			<div className="field is-grouped">
				<div className="control">
				<button type='button' className="button is-primary" onClick={() => saveIntelgroup()}>
					<span className="icon is-small">
						<i className="fa fa-plus"></i>
					</span>
					<span>Create intel group</span>
				</button>
				</div>
				<div className="control">
					<Link to="/">
						<button className="button is-text">
						<span>Cancel</span>
						</button>
					</Link>
				</div>
			</div>
		</section>
	);
}

const HomePage = (props) =>{
	console.log(props);
	
	if(props.mygroups.length == 0)
		return <AddIntelgroup users={props.users} client={props.client} />
	else
		return <Welcome/>
}
export default HomePage;