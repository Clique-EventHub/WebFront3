import { combineReducers } from 'redux';
import pagesReducer from './pagesReducer';

import reducer_get_channel from './reducer_get_channel';
import reducer_get_event from './reducer_get_event';
import reducer_search_event from './reducer_search_event';
import reducer_search_channel from './reducer_search_channel';
import reducer_search_date from './reducer_search_date';
import reducer_search_tag from './reducer_search_tag';
import reducer_fetch_all_channels from './reducer_fetch_all_channels';
import reducer_fetch_all_events from './reducer_fetch_all_events';
import reducer_fetch_new_event from './reducer_fetch_new_event';
import reducer_user from './reducer_user';

import reducer_fb from './reducer_FB';

const rootReducer = combineReducers({
    pages: pagesReducer,
    a_getChannelObj: reducer_get_channel,
    a_allChannelsObj: reducer_fetch_all_channels,
    a_getEventObj: reducer_get_event,
    a_searchEventObj: reducer_search_event,
    a_searchChannelObj: reducer_search_channel,
    a_searchTagObj: reducer_search_tag,
    a_searchDateObj: reducer_search_date,
    a_allEventsObj: reducer_fetch_all_events,
    a_newEventsObj: reducer_fetch_new_event,
    fb: reducer_fb,
    user: reducer_user
    //fb
});

export default rootReducer;
