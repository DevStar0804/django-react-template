import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ReactTags from 'react-tag-autocomplete';
import { Alert, AlertTitle } from '@material-ui/lab';
import { Container, Dialog } from "@material-ui/core";

const UpdateUser = function (props) {
  const [tags, setTags] = useState([]);
  const [isAlert, setIsAlert] = useState(false);
  const history = useHistory();
  const reacttag = React.createRef();
  const onDelete = (i) => {
    var temp = tags.slice(0)
    temp.splice(i, 1)
    setTags(temp)
  }
  const onAddition = (tag) => {
    let mailformat = /^([A-Za-z0-9_\-\.\+])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (tag.name.match(mailformat)) {
      var temp = [].concat(tags, tag)
      setTags(temp)
    }
  }

  const inviteUser = function () {
    const emails = [];
    const users = [];
    tags.forEach(tag => {
      if (tag.name.search('\\+') > -1) {
        let pluspos = tag.name.search('\\+');
        let lastpos = tag.name.search('@');
        let flag = true;
        emails.forEach(email => {
          if (email == tag.name.substring(0, pluspos) + tag.name.substr(lastpos)) {
            flag = false;
          }
        });
        if (flag) {
          emails.push(tag.name.substring(0, pluspos) + tag.name.substr(lastpos));
        }
      }
      else {
        emails.push(tag.name);
      }
      users.push(tag.name);
    });
    let params = {
      groupid: props.groupid,
      emails: emails,
      users: users,
    };
    if (emails.length > 0) {
      document.querySelector('#button').classList.add('is-loading');
      fetch('/api/invite', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': props.client.transports[0].auth.csrfToken
        },
        credentials: 'same-origin',
        body: JSON.stringify(params)
      }).then(res => { return res.json() })
        .then(res => {
          if (Boolean(res.message)) {
            document.querySelector('#button').classList.remove('is-loading');
            setIsAlert(true);
          }
          else {
            if (!Boolean(res.users.role)) {
              props.userSaved(res.users, res.emails);
            }
            else {
              props.userSaved([], res.emails);
            }
            document.querySelector('#button').classList.remove('is-loading');
            history.push('/users');
          }
        })
    }
  };

  return (
    <Container>
      <Dialog
        maxWidth="md"
        fullWidth
        open={isAlert}
        onClose={() => setIsAlert(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Alert severity="warning" className="my-5">
          <AlertTitle className="subtitle is-4 has-text-weight-bold">Fail</AlertTitle>
          <span className="subtitle is-5">! You must upgrade your Intel Group plan to perform that action.</span>
        </Alert>
      </Dialog>
      <section className="section app-card">
        <h2 className="subtitle">User Details</h2>
        <div className="field" id="users">
          <label className="label">Email</label>
          <ReactTags
            ref={reacttag}
            tags={tags}
            onDelete={onDelete}
            onAddition={onAddition}
            allowNew={true}
            addOnBlur={true}
            placeholderText="Comma separated list of emails for users to invite"
            delimiters={['Enter', 'Tab', ',', ' ']}
          />
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button type='button' className="button is-primary" id="button" onClick={() => inviteUser()}>
              <span>Invite</span>
            </button>
          </div>
          <div className="control">
            <button className="button is-text" onClick={() => history.push(`/intel_group/${props.currentgroup}/users`)}>
              <span>Cancel</span>
            </button>
          </div>
        </div>
      </section>
    </Container>
  );
};

export default UpdateUser;
