import { combineReducers } from 'redux';
import pagesReducer from './pagesReducer';
import reducer_user from './reducer_user';
import reducer_event_and_channel_map from './reducer_event_and_channel_map';

import reducer_fb from './reducer_FB';

const rootReducer = combineReducers({
    pages: pagesReducer,
    fb: reducer_fb,
    user: reducer_user,
    map: reducer_event_and_channel_map
    //fb
});

export default rootReducer;
