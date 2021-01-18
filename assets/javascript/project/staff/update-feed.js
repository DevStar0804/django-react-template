import React, {useState, useEffect} from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
	Container,
	TextField,
	Button,
	Tooltip,
} from "@material-ui/core";
import Alert from '@material-ui/lab/Alert';
import HelpIcon from '@material-ui/icons/HelpOutline';
import { yellow } from '@material-ui/core/colors';

import {getAction} from "../../api";
import {API_ROOT} from "../const";

const UpdateFeed = (props) => {
	const [url, setUrl] = useState(props.url || '');
	const [name, setName] = useState(props.name || '');
	const [description, setDescription] = useState(props.description || '');
	const [category, setCategory] = useState(props.category_id || '');
	const [tags, setTags] = useState(props.tags || '');
	const history = useHistory();
	const [confidence, setConfidence] = useState(props.confidence || '');
	const [urlError, setUrlError] = useState(false);
	const [nameError, setNameError] = useState(false);
	const [descriptionError, setDescriptionError] = useState(false);
	const [categoryError, setCategoryError] = useState(false);
	const [tagError, setTagError] = useState(false);
	const [groupError, setGroupError] = useState(false);

	const updateFeed = () => {
		let data;
		props.categories.forEach(cate => {
			if(cate.id == category)
				data = cate;
		});
		let params ={
			url: url,
			name: name,
			description: description,
			category: category,
			tags: tags,
			confidence: confidence,
		}

		// let action;
		if(props.id){
			params['id'] = props.id;
			params['manage_enabled'] = 'true';
		}
		else{
			params['intelgroup_id'] = props.currentgroup;
			params['manage_enabled'] = 'false';
            if(props.currentgroup == '') setGroupError(true);
		}
		
		if(url.trim() == '') setUrlError(true);
		if(name.trim() == '') setNameError(true);
		if(description.trim() == '') setDescriptionError(true);
		if(category == '') setCategoryError(true);
		if(tags.trim() == '') setTagError(true);

		if(url && name && description && category && tags ){
			if(Boolean(props.id)){
                fetch('/api/feeds', {
                    method: 'put',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': props.client.transports[0].auth.csrfToken
                    },
                    credentials: 'same-origin',
                    body: JSON.stringify(params)
                }).then(res=>{return res.json()})
                .then(res=>{
                    props.saveFeed(res);
                    history.push('/feeds');
                })
			}
			else{
				if(props.currentgroup != '')
					fetch('/api/feeds', {
						method: 'post',
						headers: {
							'Content-Type': 'application/json',
							'X-CSRFToken': props.client.transports[0].auth.csrfToken,
						},
						credentials: 'same-origin',
						body: JSON.stringify(params),
					}).then(res=>{return res.json()})
					.then(res=>{
						props.saveFeed(res);
						history.push('/feeds');
					})
			}
		}
	}

	useEffect(() => {

	},[]);

	
	return (
		<Container>
			<h1 className="title is-3 pt-1" >Add Custom Feed</h1>
			<section className="section app-card">
				<div className="columns">
                    <div className="column is-two-thirds">
                        {groupError && <Alert severity="error" onClose={()=>setGroupError(false)}>Please select Intel Group.</Alert>}
                        {Boolean(props.id)?
                        <TextField
                            label="URL"
                            disabled={true}
                            placeholder="http://rss.cnn.com/rss/edition.rss"
                            className="column is-four-fifths"
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            value={url}
                            onChange={(event) => {setUrl(event.target.value); setUrlError(false);}}
                        />:
                        <><TextField
                            label="URL"
                            placeholder="http://rss.cnn.com/rss/edition.rss"
                            className="column is-four-fifths"
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            value={url}
                            onChange={(event) => {setUrl(event.target.value); setUrlError(false);}}
                        /><Tooltip title="If RSS type. URL of the RSS feed, must be RSS." arrow><HelpIcon className="mt-5" style={{color:yellow[900]}} fontSize="large"/></Tooltip></>}
                        {urlError&&<p className="help is-danger"><span>This field may not be blank.</span></p>}
                        <TextField
                            label="Name"
                            placeholder="write a name of feed"
                            className="column is-four-fifths"
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            value={name}
                            onChange={(event) => {setName(event.target.value); setNameError(false);}}
                        /><Tooltip title="Name to be displayed in UI" arrow><HelpIcon className="mt-5" style={{color:yellow[900]}} fontSize="large"/></Tooltip>
                        {nameError&&<p className="help is-danger"><span>This field may not be blank.</span></p>}
                        <><TextField
                            id="outlined-full-width3"
                            label="Description"
                            placeholder="write about description of feed"
                            className="column is-four-fifths"
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            value={description}
                            onChange={(event) => {setDescription(event.target.value); setDescriptionError(false);}}
                        /><Tooltip title="Description to be displayed in UI" arrow><HelpIcon className="mt-5" style={{color:yellow[900]}} fontSize="large"/></Tooltip></>
                        {descriptionError&&<p className="help is-danger"><span>This field may not be blank.</span></p>}
                        <><TextField
                            id="outlined-select-currency-native"
                            select
                            className="mt-4 mb-2 column is-four-fifths"
                            label="Category"
                            value={category}
                            onChange={(event) => {setCategory(event.target.value); setCategoryError(false);}}
                            SelectProps={{
                                native: true,
                            }}
                            variant="outlined"
                        >
                            <option>Select category</option>
                            {props.categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </TextField><Tooltip title="User can select from fixed list set by admin" arrow><HelpIcon className="mt-5" style={{color:yellow[900]}} fontSize="large"/></Tooltip></>
                        {categoryError&&<p className="help is-danger"><span>This field may not be blank.</span></p>}
                        <><TextField
                            id="outlined-full-width5"
                            label="Tags"
                            placeholder="Tags Field, e.g. "
                            className="column is-four-fifths"
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            value={tags}
                            onChange={(event) => {setTags(event.target.value); setTagError(false);}}
                        /><Tooltip title="User can assign 0 or more tags (manual entry, auto identify existing tags, letters, numbers and - only)" arrow><HelpIcon className="mt-5" style={{color:yellow[900]}} fontSize="large"/></Tooltip></>
                        {tagError&&<p className="help is-danger"><span>This field may not be blank.</span></p>}
                        <><TextField
                            id="outlined-select-currency-native"
                            select
                            className="mt-4 column is-four-fifths"
                            label="Confidence"
                            value={confidence}
                            onChange={(event) => setConfidence(event.target.value)}
                            SelectProps={{
                                native: true,
                            }}
                            variant="outlined"
                        >
                            <option>Select confidence</option>
                            {props.confidences.map((confidence) => (
                                <option key={confidence} value={confidence}>
                                    {confidence}
                                </option>
                            ))}
                        </TextField><Tooltip title="Value between 1 and 100 for how reliable is source" arrow><HelpIcon className="mt-5" style={{color:yellow[900]}} fontSize="large"/></Tooltip></>
                    </div>
						
				</div>
                <Button variant="contained" className="button is-primary" onClick={() => updateFeed()}>
                    Enable
                </Button>
                <Link to="/feeds">
                    <button className="button is-text">
                        <span>Cancel</span>
                    </button>
                </Link>
			</section>
		</Container>
	);
}

export default UpdateFeed