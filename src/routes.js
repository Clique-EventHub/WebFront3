import React, { Component } from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './components/app';
import requireLogin from './hoc/requireLogin';

import LoginPage from './pages/loginPage';
import HomePage from './pages/homePage';
import ChannelPage from './pages/channelPage';
import EditProfile from './pages/myEventPage';
import tag from './pages/tagPage';
import TablePage from './pages/tablePage';
import CalendarPage from './pages/calendarPage';
import EditEvent from './container/editEvent2'
import ChannelInfo from './container/channelInfo';
import FormPage from './pages/formPage';
import EditChannelPage from './pages/editChannel';
import ChannelDetail from './container/channelDetail';
import MyEventPage from './pages/myEventPage';
import FeedbackPage from './pages/FeedbackPage';
import FallbackPage from './pages/FallbackPage';

export default (
    <Route path="/" component={App}>
        <IndexRoute component={HomePage} />
        <Route path="signup" component={LoginPage} />
        <Route path="tagpage" component={tag} />
        <Route path="channel/:id" component={ChannelPage} />
        <Route path="editchannel/:id" component={EditChannelPage} />
        <Route path="myEvent" component={requireLogin(MyEventPage)} />
        <Route path="table" component={requireLogin(TablePage)} />
        <Route path="calendar" component={CalendarPage} />
        <Route path="form" component={requireLogin(FormPage)} />
        <Route path="feedback" component={FeedbackPage} />
        <Route path="*" component={FallbackPage} />
    </Route>
);
