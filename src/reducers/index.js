import { combineReducers } from 'redux';
import pagesReducer from './pagesReducer';
import reducer_user from './reducer_user';

import reducer_fb from './reducer_FB';

const rootReducer = combineReducers({
    pages: pagesReducer,
    fb: reducer_fb,
    user: reducer_user
    //fb
});

export default rootReducer;
