import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from "./store";
import HomePage from '../Home';
import TopNavbar from '../components/topnavbar';
import MenuBar from '../components/menubar';
import IntelGroup from '../intelgroups/intel-group';
import Feeds from '../feeds';
import Extractions from '../extractions';
import IntelReports from '../intelreports';
import WhiteLists from '../whitelist';
import Account from '../profile';
import User from '../users';
import IntelGroups from '../intelgroups';
import FeedLists from '../feedlist';
import ConfiguredFeeds from '../configuredfeeds';
import GroupList from '../intelgroups/grouplist';


const Loading = () => {
  return (
    <div className='app-card has-text-centered'>
      <div className="lds-ripple"><div></div><div></div></div>
      <p className="heading has-text-primary">Loading...</p>
    </div>
  )
}

const App = () => {
  let auth = new coreapi.auth.SessionAuthentication({
    csrfCookieName: 'csrftoken',
    csrfHeaderName: 'X-CSRFToken'
  });
  const client = new coreapi.Client({ auth: auth });
  const [isLoading, setIsLoading] = useState(true);
  const [mygroups, setMyGroups] = useState([]);
  const [onboarding, setOnBoarding] = useState(false);
  const [currentgroup, setCurrentGroup] = useState(localStorage.getItem('currentgroup') || '');
  const [isPlan, setIsPlan] = useState(true);
  const [planname, setPlanName] = useState('');
  const [isInit, setIsInit] = useState(false);
  const [isAutoDown, setIsAutoDown] = useState(false);
  const [message, setMessage] = useState('');
  const [currentrole, setCurrentRole] = useState({});
  const [addgroup, setAddGroup] = useState(false);

  useEffect(() => {
    let params = {}
    if (localStorage.getItem('currentgroup')) {
      params['id'] = localStorage.getItem('currentgroup');
      fetch('/api/home', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': client.transports[0].auth.csrfToken
        },
        credentials: 'same-origin',
        body: JSON.stringify(params)
      }).then((res) => { return res.json() })
        .then(res => {
          console.log(res);
          setMyGroups(res.mygroups);
          setOnBoarding(res.onboarding);
          setCurrentRole(res.currentrole);
          setCurrentGroup(localStorage.getItem('currentgroup'));
          setIsPlan(res.isPlan);
          setPlanName(res.planname);
          setIsInit(res.isInit);
          setIsAutoDown(res.isAutoDown);
          setMessage(res.message);
          setIsLoading(false);
        })
    }
    else {
      fetch('/api/home', {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
      }).then((res) => { return res.json() })
        .then(res => {
          console.log(res);
          setMyGroups(res.mygroups);
          setOnBoarding(res.onboarding);
          setIsLoading(false);
        })
    }
  }, []);

  const currentIntelgroup = (intelgroup) => {
    if (intelgroup == 'add') {
      setAddGroup(true);
    }
    else {
      setAddGroup(false);
      let params = { id: intelgroup };
      fetch('/api/changegroup', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': client.transports[0].auth.csrfToken
        },
        credentials: 'same-origin',
        body: JSON.stringify(params)
      }).then(res => { return res.json() })
        .then(res => {
          console.log(res);
          setCurrentRole(res.currentrole);
          setCurrentGroup(intelgroup);
          setIsPlan(res.isPlan);
          setPlanName(res.planname);
          setIsInit(res.isInit);
          setIsAutoDown(res.isAutoDown);
          setMessage(res.message);
        });
    }
  }
  const intelgroupSave = (intelgroup) => {
    let flag = false;
    const newIntelgroup = [];
    for (let group of mygroups) {
      if (group.id === intelgroup.id) {
        newIntelgroup.push(intelgroup);
        flag = true;
      } else {
        newIntelgroup.push(group);
      }
    }
    if (!flag) {
      newIntelgroup.push(intelgroup);
    }
    setMyGroups(newIntelgroup);
  }
  const deleteIntelGroup = (intelgroups) => {
    setMyGroups(intelgroups);
  }

  if (isLoading)
    return <Loading />
  else
    return (
      <Provider store={store}>
        <BrowserRouter basename='/app/'>
          <TopNavbar mygroups={mygroups} client={client} currentIntelgroup={(intelgroup) => currentIntelgroup(intelgroup)} />
          <MenuBar currentrole={currentrole} currentgroup={currentgroup} client={client} addgroup={addgroup} />
          <Switch>
            <Route exact path="/">
              <HomePage onboarding={onboarding} currentrole={currentrole} mygroups={mygroups} client={client} intelgroupSave={(data) => intelgroupSave(data)} currentgroup={currentgroup} />
            </Route>
            <Route path="/newgroup">
              <IntelGroups currentgroup={currentgroup} currentrole={currentrole} isPlan={isPlan} isAutoDown={isAutoDown} isInit={isInit} client={client} message={message} intelgroupSave={(data) => intelgroupSave(data)} />
            </Route>
            <Route path="/intel_group/:id/edit">
              <IntelGroup planname={planname} client={client} currentgroup={currentgroup} currentrole={currentrole} isAutoDown={isAutoDown} isInit={isInit} message={message} intelgroupSave={(data) => intelgroupSave(data)} />
            </Route>
            <Route path="/grouplist">
              <GroupList client={client} mygroups={mygroups} currentgroup={currentgroup} />
            </Route>
            <Route path="/intel_group/:id/users" >
              <User onboarding={onboarding} mygroups={mygroups} isPlan={isPlan} isAutoDown={isAutoDown} isInit={isInit} client={client} message={message} currentrole={currentrole} currentgroup={currentgroup} />
            </Route>
            <Route path="/feeds">
              <Feeds onboarding={onboarding} mygroups={mygroups} currentgroup={currentgroup} client={client} isPlan={isPlan} isAutoDown={isAutoDown} isInit={isInit} message={message} currentrole={currentrole} />
            </Route>
            <Route path="/intel_group/:id/configuredfeeds">
              <ConfiguredFeeds currentgroup={currentgroup} client={client} isPlan={isPlan} isAutoDown={isAutoDown} isInit={isInit} message={message} currentrole={currentrole} />
            </Route>
            <Route path="/intel_group/:id/feedlist">
              <FeedLists onboarding={onboarding} currentgroup={currentgroup} client={client} isPlan={isPlan} isAutoDown={isAutoDown} isInit={isInit} message={message} currentrole={currentrole} />
            </Route>
            <Route path="/intel_group/:id/extractions">
              <Extractions onboarding={onboarding} mygroups={mygroups} client={client} currentgroup={currentgroup} isPlan={isPlan} isAutoDown={isAutoDown} isInit={isInit} message={message} currentrole={currentrole} />
            </Route>
            <Route path="/intel_group/:id/intelreports" >
              <IntelReports onboarding={onboarding} mygroups={mygroups} client={client} currentgroup={currentgroup} mygroups={mygroups} isPlan={isPlan} isAutoDown={isAutoDown} isInit={isInit} message={message} currentrole={currentrole} />
            </Route>
            <Route path="/intel_group/:id/whitelist" >
              <WhiteLists onboarding={onboarding} mygroups={mygroups} client={client} currentgroup={currentgroup} isPlan={isPlan} isAutoDown={isAutoDown} isInit={isInit} message={message} currentrole={currentrole} />
            </Route>
            <Route path="/account" >
              <Account client={client} currentgroup={currentgroup} deleteIntelGroup={(intelgroups) => deleteIntelGroup(intelgroups)} mygroups={mygroups} isPlan={isPlan} isAutoDown={isAutoDown} isInit={isInit} message={message} currentrole={currentrole} />
            </Route>
          </Switch>
        </BrowserRouter>
      </Provider>
    );
}

export default App;