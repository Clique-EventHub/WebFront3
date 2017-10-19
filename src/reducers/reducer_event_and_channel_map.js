import * as types from '../actions/types';

const initalState = {
    events: {},
    channels: {},
    users: {}
}

/*
action payload format
{
    ...[returned object]
}
*/

export default ( state = initalState, action ) => {
    switch (action.type) {
        case types.UPDATE_EVENT_MAP:
            let new_events = {
                ...state.events
            };
            new_events[action.payload._id] = action.payload;
            return {
                ...state,
                events: new_events
            }
        case types.UPDATE_CHANNEL_MAP:
            let new_channels = {
                ...state.channels,
            }
            new_channels[action.payload._id] = action.payload;
            return {
                ...state,
                channels: new_channels
            }
        case types.UPDATE_USER_MAP:
            let new_users = {
                ...state.users
            }
            new_users[action.payload._id] = action.payload;
            return {
                ...state,
                users: new_users
            }
        default:
            return state;
    }
}
