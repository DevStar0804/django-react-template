import React, { useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import ReactTags from 'react-tag-autocomplete';
import { Alert, AlertTitle } from '@material-ui/lab';
import { Tooltip, TextField, Grid, Container, Dialog } from "@material-ui/core";
import HelpIcon from '@material-ui/icons/Help';
import { yellow } from '@material-ui/core/colors';

const IntelGroups = function(props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [isPublic, setIsPublic] = useState(false);
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [currentgroup, setCurrentGroup] = useState('');
  const history = useHistory();  
  
  useEffect(() => {
    setCurrentGroup(props.currentgroup);
    console.log(currentgroup)
    console.log(props.currentgroup)
    if(currentgroup != '' && currentgroup != props.currentgroup){
      history.push(`/intel_group/${props.currentgroup}/intelreports`);
    }
  }, [props.currentgroup]);

  const reacttag= React.createRef();
  const onDelete= (i)=> {
      var temp = tags.slice(0)
      temp.splice(i, 1)
      setTags(temp)
    }
  
  const onAddition = (tag)=> {
    let mailformat = /^([A-Za-z0-9_\-\.\+])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if(tag.name.match(mailformat)){
      var temp = [].concat(tags, tag)
      setTags(temp)
    }
  }

  const saveIntelgroup = function() {
    const emails = [];
    const users = [];
    tags.forEach(tag => {
      if(tag.name.search('\\+') > -1){
        let pluspos = tag.name.search('\\+');
        let lastpos = tag.name.search('@');
        let flag = true;
        emails.forEach(email => {
          if(email == tag.name.substring(0,pluspos) + tag.name.substr(lastpos)){
          flag = false;
          }
        });
        if(flag){
          emails.push(tag.name.substring(0,pluspos) + tag.name.substr(lastpos))
        }
      }
      else{
        emails.push(tag.name)
      }
      users.push(tag.name);
    });
    let params = {
      name: name,
      description: description,
      emails: emails,
      users: users,
      ispublic: isPublic?true:false,
    };
    if(name != '' && description != ''){
      document.querySelector('#button').classList.add('is-loading');
      fetch('/api/intelgroups', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': props.client.transports[0].auth.csrfToken
        },
        credentials: 'same-origin',
        body: JSON.stringify(params)
      }).then(res=>{return res.json()})
      .then(res=>{
        props.intelgroupSave(res)
        document.querySelector('#button').classList.remove('is-loading');
        setSuccess(true);
      })
    }
    else{
      setOpen(true);
    }
  };

  if(props.currentrole.role ==0){
      return (
          <div className='app-card has-text-centered'>
              <div className="lds-ripple"><div></div><div></div></div>
              <p className="subtitle is-3">! You have an invitation to <span className="title is-3 has-text-primary">{props.currentrole.intelgroup.name}</span> pending. <Link className="muted-link subtitle is-3" to="/account" >Click here to accept.</Link></p>
          </div>
      )
  }
  if(props.currentrole.role == 4){
      return(
          <div className='section has-text-centered'>
              <p className="subtitle is-3">Your request for <span className="title is-3 has-text-primary">{props.currentrole.intelgroup.name}</span> Intel Group has not been accepted yet.</p>
          </div>
      )
  }
  else {
    return (
      <Container>
        <section className="section app-card">
          <h2 className="subtitle">Create New Intel Group</h2>
          <div className="field column is-two-thirds">
            <label className="label">Name</label>
            <TextField
              placeholder="Name of intel group"
              className="column is-three-quarters"
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              value={name}
              onChange={(event) => setName(event.target.value)}
            /><Tooltip title="Name to be displayed in UI" arrow><HelpIcon className="mt-5" style={{color:yellow[900]}} fontSize="large"/></Tooltip>
          
            <label className="label">Description</label>
            <TextField
              placeholder="Description of intel group"
              className="column is-three-quarters"
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            /><Tooltip title="Description to be displayed in UI" arrow><HelpIcon className="mt-5" style={{color:yellow[900]}} fontSize="large"/></Tooltip>
            <div style={{zIndex:1}}>
              <label className="label mb-5">Invite Users</label>
              <Grid container>
                <Grid item xs={9}>
                  <ReactTags
                    ref={reacttag}
                    tags={tags}
                    onDelete={onDelete}
                    placeholderText="Comma separated list of emails for users to invite"
                    onAddition={onAddition}
                    addOnBlur={true}
                    allowNew={true}
                    delimiters={['Enter', 'Tab', ',', ' ']}
                  />
                </Grid>
                <Grid item xs={3}>
                  <Tooltip title="Users you want to invite" arrow><HelpIcon className="mt-2" style={{color:yellow[900]}} fontSize="large"/></Tooltip>
                </Grid>
              </Grid>
            </div>
            <label className="label">Public</label>
            <TextField
              className="column is-three-quarters"
              select
              margin="normal"
              SelectProps={{
                  native: true
              }}
              variant="outlined"
              value={isPublic}
              onChange={(event) => setIsPublic(event.target.value)}
            >
              <option value={false}>False</option>
              <option value={true}>True</option>
            </TextField>
            <Tooltip title="Options to make public or private Intel Group" arrow><HelpIcon className="mt-5" style={{color:yellow[900]}} fontSize="large"/></Tooltip>
          </div>
          <div className="field is-grouped">
            <div className="control">
              <button type='button' id="button" className="button is-primary" onClick={() => saveIntelgroup()} >
                <span>Create intel group</span>
              </button>
            </div>
            <div className="control">
                <button className="button is-text" onClick={()=>{history.goBack()}}>
                  <span>Cancel</span>
                </button>
            </div>
            <Dialog
                maxWidth="md"
                fullWidth
                open={open}
                onClose={()=>setOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <Alert severity="warning" className="my-5 has-text-centered">
                    <AlertTitle className="subtitle is-4 has-text-weight-bold" fullWidth>Warning</AlertTitle>
                    <span className="subtitle is-5">Please enter name and description.</span>
                </Alert>
            </Dialog>
            <Dialog
                maxWidth="md"
                fullWidth
                open={success}
                onClose={() => {
                  setSuccess(false); 
                  history.push(`/intel_group/${props.currentgroup}/intelreports`);
                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <Alert severity="success" className="my-5">
                    <AlertTitle className="subtitle is-4 has-text-weight-bold">Success</AlertTitle>
                    <span className="subtitle is-5">Your intel group is successfully created.</span>
                </Alert>
            </Dialog>
          </div>
        </section>
        
      </Container>
    );
  }
};

export default IntelGroups;
