import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Container } from '@material-ui/core';
import { Table, Thead, Tbody, Tr, Th } from 'react-super-responsive-table';
import { Alert, AlertTitle } from '@material-ui/lab';

import IconButton from '@material-ui/core/IconButton';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import IntelgroupTable from "./intelgroup-table";
import APIKeyTable from "./apikey-table";
import WebhookTable from "./webhook-table";

const Loading = function () {
    return (
        <div className='app-card has-text-centered'>
            <div className="lds-ripple"><div></div><div></div></div>
            <p className="heading has-text-primary">Loading...</p>
        </div>
    )
}

const Profile = (props) => {
    const [email, setEmail] = useState(props.profile.email);
    const [newEmail, setNewEmail] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [isAlert, setIsAlert] = useState(false);
    const [isExist, setIsExist] = useState(false);
    const [isNotCorrect, setIsNotCorrect] = useState(false);
    const [open, setOpen] = useState(false);
    const [emailValidataion, setEmailValidation] = useState(false);
    const [pass, setPass] = useState(false);
    const [password, setPassword] = useState("");

    const [values, setValues] = useState({
        amount: '',
        password: '',
        weight: '',
        weightRange: '',
        showPassword: false,
    });

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
        setPassword(event.target.value);
    };

    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const changeEmail = () => {
        let mailformat = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if (newEmail.match(mailformat)) {
            if (newEmail.trim() == email.trim()) {
                setIsExist(true);
            }
            else {
                let params = {
                    id: props.profile.id,
                    newemail: newEmail.trim(),
                    password: password
                }
                fetch('/api/changingemail', {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': props.client.transports[0].auth.csrfToken
                    },
                    credentials: 'same-origin',
                    body: JSON.stringify(params)
                }).then(res => { return res.json(); })
                    .then(res => {
                        if (Boolean(res.isNotCorrect)) {
                            setIsNotCorrect(true);
                            setValues({
                                amount: '',
                                password: '',
                                weight: '',
                                weightRange: '',
                                showPassword: false,
                            });
                        }
                        else {
                            if (Boolean(res.isExist)) {
                                setIsExist(true);
                                setValues({
                                    amount: '',
                                    password: '',
                                    weight: '',
                                    weightRange: '',
                                    showPassword: false,
                                });
                            }
                            else {
                                setEmail(res.email);
                                setIsSuccess(true);
                                setValues({
                                    amount: '',
                                    password: '',
                                    weight: '',
                                    weightRange: '',
                                    showPassword: false,
                                });
                            }
                        }
                    })
            }
        }
        else {
            setEmailValidation(true);
            setValues({
                amount: '',
                password: '',
                weight: '',
                weightRange: '',
                showPassword: false,
            });
        }
    }

    const deleteAccount = () => {
        if (confirm("Are you sure to leave Cyobstract?"))
            fetch('/api/deleteaccount', {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'same-origin',
            }).then(res => { return res.json(); })
                .then(res => {
                    if (Boolean(res.delete)) {
                        window.location.href = "/accounts/logout";
                    }
                    if (Boolean(res.message)) {
                        setIsAlert(true);
                    }
                })
    }

    return (
        <section className="semisection">
            <h1 className="title is-3">User account</h1>
            <Dialog
                maxWidth="md"
                fullWidth
                open={isSuccess}
                onClose={() => setIsSuccess(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <Alert severity="success" className="my-5 has-text-centered">
                    <AlertTitle className="subtitle is-4 has-text-weight-bold">Success</AlertTitle>
                    <span className="subtitle is-5">Successfully changed!!!</span>
                </Alert>
            </Dialog>
            <Dialog
                maxWidth="md"
                fullWidth
                open={isExist}
                onClose={() => setIsExist(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <Alert severity="warning" className="my-5 has-text-centered">
                    <AlertTitle className="subtitle is-4 has-text-weight-bold">Warning</AlertTitle>
                    <span className="subtitle is-5">This email already exists. Please input another email.</span>
                </Alert>
            </Dialog>
            <Dialog
                maxWidth="md"
                fullWidth
                open={isAlert}
                onClose={() => setIsAlert(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <Alert severity="error" className="my-5 has-text-centered">
                    <AlertTitle className="subtitle is-4 has-text-weight-bold">Error</AlertTitle>
                    <span className="subtitle is-5">You can't delete your account. To delete an account, there should be no group you are admin.</span>
                </Alert>
            </Dialog>
            <Dialog
                maxWidth="md"
                fullWidth
                open={isNotCorrect}
                onClose={() => setIsNotCorrect(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <Alert severity="error" className="my-5 has-text-centered">
                    <AlertTitle className="subtitle is-4 has-text-weight-bold">Verification Error</AlertTitle>
                    <span className="subtitle is-5">Your password is incorrect.</span>
                </Alert>
            </Dialog>
            <Dialog
                maxWidth="md"
                fullWidth
                open={emailValidataion}
                onClose={() => setEmailValidation(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <Alert severity="warning" className="my-5 has-text-centered">
                    <AlertTitle className="subtitle is-4 has-text-weight-bold">Warning</AlertTitle>
                    <span className="subtitle is-5">Enter a valid email.</span>
                </Alert>
            </Dialog>
            <span>
                <TextField id="outlined-basic1" disabled={true} size="small" label="Email" value={email} placeholder="Email(confirmed)" variant="outlined" />
                <Dialog
                    open={open}
                    onClose={() => setOpen(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title" className="has-text-centered">Change email</DialogTitle>
                    <DialogContent>
                        {isAlert && <Alert severity="error" className="title is-size-4" onClose={() => setIsAlert(false)}>Please input exactly!!!</Alert>}
                        <div className="semisection">
                            <TextField id="outlined-basic1" label="New Email" InputLabelProps={{ shrink: true, }} size="small" placeholder="a-z 0-9@xxx.xxx" variant="outlined" onChange={(e) => setNewEmail(e.target.value)} />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <button onClick={() => { setOpen(false); setPass(true); }} className="button is-success" autoFocus>
                            Confirm
                        </button>
                        <button onClick={() => { setOpen(false); }} className="button is-danger" >
                            Cancel
                        </button>
                    </DialogActions>
                </Dialog>
                <Dialog
                    open={pass}
                    onClose={() => setPass(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title" className="has-text-centered">Confirm password</DialogTitle>
                    <DialogContent>
                        {isAlert && <Alert severity="error" className="title is-size-4" onClose={() => setIsAlert(false)}>Please input exactly!!!</Alert>}
                        <div className="semisection">
                            <FormControl variant="outlined">
                                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    type={values.showPassword ? 'text' : 'password'}
                                    value={values.password}
                                    onChange={handleChange('password')}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                            >
                                                {values.showPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    labelWidth={70}
                                />
                            </FormControl>

                        </div>
                    </DialogContent>
                    <DialogActions>
                        <button onClick={() => { changeEmail(); setPass(false); }} className="button is-success" autoFocus>
                            Confirm
                        </button>
                        <button onClick={() => { setPass(false); }} className="button is-danger" >
                            Cancel
                        </button>
                    </DialogActions>
                </Dialog>
                <button className="button is-primary ml-5" onClick={() => setOpen(true)}>Edit</button>
                <button className="button is-outlined is-pulled-right is-large" onClick={() => deleteAccount()}>Delete Account</button>
            </span>
            <p className="px-4 pt-4"><a className="muted-link" href="/accounts/password/change"><span>Reset password</span></a></p>
            <p className="px-4"><Link className="muted-link" to="password/change"><span>Enable 2FA</span></Link></p>
        </section>
    );

}

const Intelgroups = (props) => {
    const [intelgroups, setIntelgroups] = useState(props.intelgroups);
    const [isAlert, setIsAlert] = useState(false);
    const [message, setMessage] = useState('');

    const acceptInvite = (index) => {
        const params = { id: intelgroups[index].id };
        fetch('/api/acceptinvite', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': props.client.transports[0].auth.csrfToken
            },
            credentials: 'same-origin',
            body: JSON.stringify(params)
        }).then(res => { return res.json() })
            .then(res => setIntelgroups(res))
    }

    const rejectInvite = (index) => {
        const params = { id: intelgroups[index].id };
        fetch('/api/rejectinvite', {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': props.client.transports[0].auth.csrfToken
            },
            credentials: 'same-origin',
            body: JSON.stringify(params)
        }).then(res => { return res.json() })
            .then(res => {
                setIntelgroups(res);
                props.saveIntelgroups(res);
                props.deleteIntelGroup(res);
            })
    }

    const leaveGroup = (index) => {
        const params = { id: intelgroups[index].id };
        let message = '';
        if (intelgroups[index].role == 4)
            message = 'Are you sure to cancel invite request?'
        else
            message = 'Are you sure to leave this group?'
        if (confirm(message))
            fetch('/api/leavegroup', {
                method: 'delete',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': props.client.transports[0].auth.csrfToken
                },
                credentials: 'same-origin',
                body: JSON.stringify(params)
            }).then(res => { return res.json() })
                .then(res => {
                    if (Boolean(res.message)) {
                        setMessage("You can't leave the group. Before leaving group, you must make other people admin.")
                        setIsAlert(true);
                    }
                    else {
                        setIntelgroups(res);
                        props.deleteIntelGroup(res);
                        props.saveIntelgroups(res);
                    }
                })
    }

    return (
        <section className="semisection">
            <h1 className="title is-5 py-4">Intel groups you belong to</h1>
            <Dialog
                maxWidth="md"
                fullWidth
                open={isAlert}
                onClose={() => setIsAlert(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <Alert severity="error" className="my-5 has-text-centered">
                    <AlertTitle className="subtitle is-4 has-text-weight-bold">Error</AlertTitle>
                    <span className="subtitle is-5">{message}</span>
                </Alert>
            </Dialog>
            <Table className="table is-striped is-fullwidth has-vcentered-cells">
                <Thead>
                    <Tr>
                        <Th>Name</Th>
                        <Th>Role</Th>
                        <Th>Action</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {intelgroups.map((intelgroup, index) => {
                        return <IntelgroupTable index={index} key={intelgroup.id} intelgroup={intelgroup}
                            acceptInvite={(index) => acceptInvite(index)} rejectInvite={(index) => rejectInvite(index)} leaveGroup={(index) => leaveGroup(index)} />
                    })}
                </Tbody>
            </Table>
        </section>
    );
}

const APIKeys = (props) => {
    const [apikeys, setAPIKeys] = useState(props.apikeys);
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [isAlert, setIsAlert] = useState(false);
    const createAPIKey = () => {

        let params = { 'name': name }
        if (name.trim() != '')
            fetch('/api/apikeys', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': props.client.transports[0].auth.csrfToken,
                },
                credentials: 'same-origin',
                body: JSON.stringify(params),
            }).then((res) => { return res.json() })
                .then((res) => {
                    setAPIKeys(res);
                    setOpen(false);
                });
        else setIsAlert(true);
    }

    const deleteAPIKey = (index) => {

        let params = { id: apikeys[index].id };
        if (confirm('Are you sure to delete this APIKey?'))
            fetch('/api/apikeys', {
                method: 'delete',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': props.client.transports[0].auth.csrfToken,
                },
                credentials: 'same-origin',
                body: JSON.stringify(params),
            }).then((res) => { return res.json() })
                .then((res) => {
                    setAPIKeys(res);
                });
    }

    return (
        <section className="semisection">
            <h1 className="title is-5">Your API keys</h1>
            <button className="button is-success" onClick={() => setOpen(true)}>
                <span>Create new key</span>
            </button>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Create new API key</DialogTitle>
                <DialogContent>
                    {isAlert && <Alert severity="error" className="title is-size-4" onClose={() => setIsAlert(false)}>Please input exactly!!!</Alert>}
                    <div className="semisection">
                        <TextField id="outlined-basic" size="small" placeholder="name" variant="outlined" onChange={(e) => setName(e.target.value)} />
                    </div>
                </DialogContent>
                <DialogActions>
                    <button onClick={() => { createAPIKey(); }} className="button is-success" autoFocus>
                        Confirm
                    </button>
                    <button onClick={() => { setOpen(false); }} className="button is-danger" >
                        Cancel
                    </button>
                </DialogActions>
            </Dialog>
            <Table className="table is-striped is-fullwidth has-vcentered-cells">
                <Thead>
                    <Tr>
                        <Th>API Key</Th>
                        <Th>Name</Th>
                        <Th>Intel Groups</Th>
                        <Th>Action</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {apikeys.map((apikey, index) => {
                        return <APIKeyTable index={index} key={apikey.id} apikey={apikey} deleteAPIKey={(index) => deleteAPIKey(index)} intelgroups={props.intelgroups} />

                    })}
                </Tbody>
            </Table>
        </section>
    );
}

const WebHooks = (props) => {
    const [webhooks, setWebHooks] = useState(props.webhooks);
    const [isAlert, setIsAlert] = useState(false);
    const [description, setDescription] = useState('');
    const [endpoint, setEndpoint] = useState('');
    const [words, setWords] = useState('');
    const [intelgroup, setIntelgroup] = useState('0');
    const [open, setOpen] = useState(false);

    const createWebhook = () => {
        let params = { endpoint: endpoint.trim(), intelgroup_id: intelgroup, description: description.trim(), words: words.trim() }
        if (intelgroup != '0' && endpoint.trim() != '' && description.trim() != '')
            fetch('/api/webhooks', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': props.client.transports[0].auth.csrfToken,
                },
                credentials: 'same-origin',
                body: JSON.stringify(params),
            }).then((res) => { return res.json() })
                .then((res) => {
                    setWebHooks(res);
                    setOpen(false);
                });
        else setIsAlert(true);
    }

    const saveWebhooks = (newWebhooks) => {
        setWebHooks(newWebhooks);
    }

    return (
        <section className="semisection">
            <h1 className="title is-5">Your webhooks</h1>
            <button className="button is-success" onClick={() => setOpen(true)}>
                <span>Create new webhook</span>
            </button>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Add a webhook endpoint</DialogTitle>
                <DialogContent>
                    {isAlert && <Alert severity="error" className="title is-size-4" onClose={() => setIsAlert(false)}>Please input exactly!!!</Alert>}
                    <div className="semisection">
                        <TextField id="outlined-basic1" label="Destination" InputLabelProps={{ shrink: true, }} size="small" placeholder="https://..." variant="outlined" onChange={(e) => setEndpoint(e.target.value)} />
                    </div>
                    <div className="semisection">
                        <TextField id="outlined-basic" label="Description" InputLabelProps={{ shrink: true, }} size="small" placeholder="Description" variant="outlined" onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div className="semisection">
                        <TextField
                            id="outlined-select-currency-native"
                            select
                            label="Intel groups to listen on"
                            fullWidth
                            size="small"
                            value={intelgroup}
                            onChange={(e) => setIntelgroup(e.target.value)}
                            SelectProps={{
                                native: true,
                            }}
                            variant="outlined"
                        >
                            <option value="0"></option>
                            {props.intelgroups.map((intelgroup) => (
                                <option key={intelgroup.id} value={intelgroup.intelgroup.id}>
                                    {intelgroup.intelgroup.name}
                                </option>
                            ))}
                        </TextField>
                    </div>
                    <div className="semisection">
                        <TextField id="outlined-basic2" label="Words to listen on" InputLabelProps={{ shrink: true, }} size="small" placeholder="words to listen on" variant="outlined" onChange={(e) => setWords(e.target.value)} />
                    </div>
                </DialogContent>
                <DialogActions>
                    <button onClick={() => { createWebhook(); setOpen(false); }} className="button is-success" autoFocus>
                        Confirm
                    </button>
                    <button onClick={() => { setOpen(false); }} className="button is-danger" >
                        Cancel
                    </button>
                </DialogActions>
            </Dialog>
            <Table className="table is-striped is-fullwidth has-vcentered-cells my-4">
                <Thead>
                    <Tr>
                        <Th>Endpoint</Th>
                        <Th>Description</Th>
                        <Th>Intel Group</Th>
                        <Th>Words</Th>
                        <Th>Action</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {webhooks.map((webhook, index) => {
                        return <WebhookTable index={index} key={webhook.id} webhook={webhook} intelgroups={props.intelgroups} client={props.client} saveWebhooks={(newWebhooks) => saveWebhooks(newWebhooks)} />

                    })}
                </Tbody>
            </Table>
        </section>
    );
}

const Account = (props) => {
    const [isLoading, setIsLoading] = useState(true);
    const [profile, setProfile] = useState([]);
    const [intelgroups, setIntelGroups] = useState([]);
    const [apikeys, setAPIKeys] = useState([]);
    const [webhooks, setWebHooks] = useState([]);
    const history = useHistory();

    useEffect(() => {
        if (!Boolean(localStorage.getItem('groupid'))) {
            localStorage.setItem('groupid', props.currentgroup);
            if (props.currentgroup == '') {
                localStorage.setItem('groupid', 1);
            }
            fetch('/api/account', {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json',
                },
                credentials: 'same-origin',
            }).then((response) => { return response.json(); })
                .then((res) => {
                    setProfile(res.profile);
                    setWebHooks(res.webhooks);
                    setAPIKeys(res.apikeys);
                    setIntelGroups(res.intelgroups);
                    setIsLoading(false);
                });
        }
        else {
            localStorage.removeItem('groupid');
            history.push(`/intel_group/${props.currentgroup}/intelreports`);
        }
    }, [props.currentgroup]);

    const saveIntelgroups = (intelgroups) => {
        setIntelGroups(intelgroups);
    }

    const AccountView = () => {
        if (isLoading)
            return <Loading />
        else
            return (
                <Container>
                    <Profile profile={profile} client={props.client} intelgroups={intelgroups} mygroups={props.mygroups} />
                    <Intelgroups intelgroups={intelgroups} client={props.client} deleteIntelGroup={props.deleteIntelGroup} saveIntelgroups={saveIntelgroups} />
                    <APIKeys apikeys={apikeys} client={props.client} intelgroups={intelgroups} />
                    <WebHooks webhooks={webhooks} client={props.client} intelgroups={intelgroups} />
                </Container>
            )
    }
    return AccountView();
}

export default Account;
