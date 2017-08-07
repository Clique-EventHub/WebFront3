import React from 'react';
import ReactDOM from 'react-dom';
// import App from './components/app.js'
// import App from './container/profilePopup.js';

import { Router, hashHistory } from 'react-router';
import routes from './routes';

import './index.css';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';

import logger from 'redux-logger';
import thunk from 'redux-thunk';
// import promise from 'redux-promise-middleware';

import rootReducer from './reducers/index';

export const DEBUG = true;
let middlewares = [DEBUG && logger, thunk].filter(Boolean);

//Currently there is a problem with redux-promise

const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore);
export const myStore = createStoreWithMiddleware(rootReducer);

ReactDOM.render(
    <Provider store={myStore}>
        <Router history={hashHistory} routes={routes} />
    </Provider>,
  document.getElementById('root')
);
