import React, { useState, useEffect } from "react";
import { Switch, Route, Link, useHistory } from "react-router-dom";
import { Container, TextField, Grid, Dialog } from "@material-ui/core";
import { Alert, AlertTitle } from '@material-ui/lab';
import { Steps } from 'intro.js-react';

import UpdateFeed from "./update-feed";
import FeedCard from "./feed-card";

const Loading = () => {
	return (
		<div className='app-card has-text-centered'>
			<div className="lds-ripple"><div></div><div></div></div>
			<p className="heading has-text-primary">Loading...</p>
		</div>
	)
}

const Plan = (props) => {
	const [isAlert, setIsAlert] = useState(false);

	const ManagePlan = () => {
		if (props.currentrole.role == 2) location.href = `/subscriptions/intelgroup/${props.currentgroup}`;
		else setIsAlert(true);
	}

	return <div className="my-6">
		<h1 className="title is-size-3 has-text-centered py-6">No plan! You must select a plan to perform that action. <a className="tag title is-3" onClick={ManagePlan}>Click here to manage your plan</a></h1>
		{isAlert && <Grid container direction="row" justify="center" alignItems="center">
			<Grid item xs={6}>
				<Alert className="has-text-centered title is-size-4" severity="error" onClose={() => setIsAlert(false)}>! Please contact the feed group administrator to manage intel group plan payment to reinstate access.</Alert>
			</Grid>
		</Grid>}
	</div>
}

const FeedList = (props) => {
	const [category, setCategory] = useState('');
	const [tag, setTag] = useState('');
	const [confidence, setConfidence] = useState('');
	const [webhook, setWebhhook] = useState(false);
	const [stepsEnabled, setStepsEnabled] = useState(true);
	const steps = [{
		element: '#card',
		title: 'Global Feed',
		intro: '<br/> Click "Enable" button to add feed in your Intel Group'
	}]

	const search = () => {
		let tag_value = "";
		for (const t of props.tags) {
			if (t.id == tag) tag_value = t.name
		}
		props.Search(category, tag_value, confidence);
	}

	const saveFeed = (data) => {
		setWebhhook(data.webhook_fail);
		props.saveFeed(data);
	}

	return (
		<Container>
			{props.onboarding &&
				<Steps
					enabled={stepsEnabled}
					steps={steps}
					initialStep={0}
					onBeforeExit={() => { return false; }}
					// onBeforeChange={(nextIndex)=>{
					// 	if(nextIndex == 0 || nextIndex == 1){
					// 		return true;
					// 	}
					// 	else{
					// 		return false;
					// 	}
					// }}
					onAfterChange={(nextIndex, newElement) => {
						if (nextIndex == 0) {
							newElement.addEventListener('click', function () {
								setStepsEnabled(false);
								window.location.href = "/app/feedlist";
							})
						}
					}}
					onExit={() => { }}
				/>}
			<Dialog
				maxWidth="md"
				fullWidth
				open={webhook}
				onClose={() => setWebhhook(false)}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<Alert severity="warning" className="my-5">
					<AlertTitle className="subtitle is-4 has-text-weight-bold">Fail</AlertTitle>
					<span className="subtitle is-5">Outgoing webhook is failed.</span>
				</Alert>
			</Dialog>
			<section className="section">
				{props.isInit &&
					<Alert severity="info" className="my-5">
						<AlertTitle className="subtitle is-4 has-text-weight-bold">Info</AlertTitle>
						<span className="subtitle is-5">{props.message}</span>
					</Alert>}
				<Grid container>
					<Grid item xs={3}>
						<label className="title is-3">Feed Store</label>
					</Grid>
					<Grid item xs={1}>
						<div style={{ paddingTop: 16 + 'px' }}>
							<label className="title is-5" >filter:</label>
						</div>
					</Grid>
					<Grid item xs={5}>
						<span>
							<TextField
								id="outlined-select-currency-native"
								select
								className="mx-2"
								value={confidence}
								onChange={(event) => setConfidence(event.target.value)}
								SelectProps={{
									native: true,
								}}
								variant="outlined"
							>
								<option value="" className="has-text-white">Confidence</option>
								{props.confidences.map((confidence) => (
									<option key={confidence} value={confidence}>
										{confidence}
									</option>
								))}
							</TextField>
							<TextField
								id="outlined-select-currency-native"
								select
								className="mx-2"
								value={category}
								onChange={(event) => setCategory(event.target.value)}
								SelectProps={{
									native: true,
								}}
								variant="outlined"
							>
								<option value="" className="has-text-white">Category</option>
								{props.categories.map((category) => (
									<option key={category.id} value={category.id}>
										{category.name}
									</option>
								))}
							</TextField>
							<TextField
								id="outlined-select-currency-native"
								select
								className="mx-2"
								value={tag}
								onChange={(event) => setTag(event.target.value)}
								SelectProps={{
									native: true,
								}}
								variant="outlined"
							>
								<option value="" className="has-text-white">Tag</option>
								{props.tags.map((tag) => (
									<option key={tag.id} value={tag.id}>
										{tag.name}
									</option>
								))}
							</TextField>
						</span>
					</Grid>
					<Grid item xs={3}>
						<span>
							<button className="button is-success is-rounded mx-2" onClick={search} >
								Filter
							</button>
						</span>
					</Grid>
				</Grid>
			</section>
			{props.currentrole.role == 2 && props.customfeeds &&
				<section className="section" >
					<Link to="/feeds/new">
						{props.customfeeds && <button className="button is-medium is-link is-rounded">
							<span>Create custom feed</span>
						</button>}
					</Link>
				</section>}
			{
				props.groupfeeds.map((groupfeed, index) => {
					return <FeedCard index={index} key={groupfeed.id} feed={groupfeed} currentgroup={props.currentgroup} currentrole={props.currentrole} client={props.client} />;
				})
			}
			{
				props.feedlist.map((feed, index) => {
					return <FeedCard index={index} key={feed.id} feed={feed} currentgroup={props.currentgroup} currentrole={props.currentrole} saveFeed={(data) => saveFeed(data)} client={props.client} />;
				})
			}

		</Container>
	);
}


const Feeds = (props) => {
	const [isLoading, setIsLoading] = useState(true);
	const [feedlist, setFeedList] = useState([]);
	const [groupfeeds, setGroupFeeds] = useState([]);
	const [categories, setCategories] = useState([]);
	const [tags, setTags] = useState([]);
	const [customfeeds, setCustomFeeds] = useState(true);
	const [currentgroup, setCurrentGroup] = useState('');
	
	const history = useHistory();
	const confidences = [];
	for (let i = 1; i <= 100; i++) {
		confidences.push(i);
	}
	
	useEffect(() => {
		if (props.currentgroup == '' && props.mygroups.length != 0 && !props.onboarding) {
			history.push('/');
		}
		else {
			setCurrentGroup(props.currentgroup);
			if(currentgroup!='' && currentgroup != props.currentgroup){
				history.push(`/intel_group/${props.currentgroup}/intelreports`);
			}
			else{

				let params = {
					id: props.currentgroup
				}
				fetch('/api/feedlist', {
					method: 'post',
					headers: {
						'Content-Type': 'application/json',
						'X-CSRFToken': props.client.transports[0].auth.csrfToken
					},
					credentials: 'same-origin',
					body: JSON.stringify(params)
				}).then(res => { return res.json() })
					.then(res => {
						setFeedList(res.feedlist);
						setGroupFeeds(res.groupfeeds)
						setCategories(res.categories);
						setTags(res.tags);
						setCustomFeeds(res.customfeeds);
						setIsLoading(false);
					});
			}
		}
	}, [props.currentgroup]);

	const Search = (category, tag, confidence) => {
		let params = {
			category: category,
			tags: tag,
			confidence: confidence,
			currentgroup: currentgroup
		}
		fetch('/api/searchfeeds', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': props.client.transports[0].auth.csrfToken
			},
			credentials: 'same-origin',
			body: JSON.stringify(params)
		}).then(res => { return res.json() })
			.then(res => {
				saveFeed(res);
			})
	}

	const FeedListView = () => {
		if (isLoading) {
			return <Loading />
		}
		else {
			if (props.currentrole.role == 0) {
				return (
					<div className='app-card has-text-centered'>
						<div className="lds-ripple"><div></div><div></div></div>
						<p className="subtitle is-3">! You have an invitation to <span className="title is-3 has-text-primary">{props.currentrole.intelgroup.name}</span> pending. <Link className="muted-link subtitle is-3" to="/account" >Click here to accept.</Link></p>
					</div>
				)
			}
			if (props.currentrole.role == 1) {
				return (
					<div className='section has-text-centered'>
						<p className="subtitle is-3">! You are now a member of <span className="title is-3 has-text-primary">{props.currentrole.intelgroup.name}</span>.</p>
					</div>
				)
			}
			if (props.currentrole.role == 2 || props.onboarding) {
				if (props.isPlan)
					return <FeedList client={props.client} saveFeed={saveFeed} feedlist={feedlist} categories={categories} tags={tags} groupfeeds={groupfeeds} onboarding={props.onboarding}
						Search={Search} confidences={confidences} currentgroup={currentgroup} currentrole={props.currentrole} isInit={props.isInit} message={props.message} customfeeds={customfeeds} />
				else return <Plan currentgroup={currentgroup} currentrole={props.currentrole} />
			}
			if (props.currentrole.role == 4) {
				return (
					<div className='section has-text-centered'>
						<p className="subtitle is-3">Your request for <span className="title is-3 has-text-primary">{props.currentrole.intelgroup.name}</span> Intel Group has not been accepted yet.</p>
					</div>
				)
			}
			// else{
			// 	if(props.isPlan){
			// 		return <FeedList client={props.client} saveFeed={saveFeed} feedlist={feedlist} categories={categories} tags={tags} 
			// 			Search={Search} confidences={confidences} currentrole={currentrole} isInit={props.isInit} message={props.message} customfeeds={customfeeds} />
			// 	}
			// 	else{
			// 		return <Plan currentgroup={props.currentgroup} currentrole={currentrole} />
			// 	}

			// }
		}
	}

	const getFeedById = (id) => {
		for (const feed of feedlist) {
			if (feed.uniqueid == id)
				return feed;
		};
	}

	const saveFeed = (result) => {
		setFeedList(result.feeds);
		setGroupFeeds(result.groupfeeds);
	}

	const renderUpdateFeed = (data) => {
		if (isLoading) {
			return <Loading />;
		}
		else {
			const feed_id = data.match.params.id;
			if (feed_id == 'new') {
				return (
					<UpdateFeed client={props.client} categories={categories} currentrole={props.currentrole}
						alltags={tags} saveFeed={saveFeed} currentgroup={currentgroup} confidences={confidences} />
				);
			}
			else {
				const feed = getFeedById(feed_id);
				return (
					<UpdateFeed client={props.client} {...feed} categories={categories} currentrole={props.currentrole}
						alltags={tags} saveFeed={saveFeed} currentgroup={currentgroup} confidences={confidences} />
				);
			}
		}
	}

	return (
		<Switch>
			<Route path="/feeds/:id" render={(props) => renderUpdateFeed(props)} >
			</Route>
			<Route path="/feeds">
				{FeedListView()}
			</Route>
		</Switch>
	);
}

export default Feeds;