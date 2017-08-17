import { GET_USER_INFO,
    UPDATE_USER_EVENTS_INFO_JOIN,
    UPDATE_USER_EVENTS_INFO_INTEREST,
    UPDATE_USER_EVENTS_INFO_SUBSCRIBE,
    UPDATE_USER_ADMIN_INFO,
    FB_FETCH_BASIC_INFO,
    FB_FETCH_USERS_FRIENDS_LIST,
    UPDATE_USER_FRIENDS_INFO } from '../actions/types';

export const inMeta = [
        "_id",
        "facebookId",
        "firstName",
        "lastName",
        "picture",
        "picture_200px",
        "email"
    ]

const initalState = {
    'refObj': null,
    'meta': {
        'id': null,
        "facebookId": null,
        'email': null,
        "firstName": null,
        "lastName": null,
        "picture": null,
        "picture_200px": null
    },
    'info': {
        "gender": null,
        "phone": null,
        "shirt_size": null,
        "allergy": null,
        "disease": null,
        "regId": null,
        "twitterUsername": null,
        "lineId": null,
        "birth_day": null,
        'friends_list': []
    },
    'events': {
        "notification": [],
        'general': {
            'join': [],
            'subscribe': [],
            'interest': []
        },
        'admin': {
            'event': [],
            'channel': []
        }
    }
}

/*
{
    'meta': {
        'id': null,
        "facebookId": null,
        'email': null,
        "firstName": null,
        "lastName": null,
        "picture": null,
        "picture_200px": null
    },
    'info': {
        "gender": null,
        "phone": null,
        "shirt_size": null,
        "allergy": null,
        "disease": null,
        "regId": null,
        "twitterUsername": null,
        "lineId": null,
        "birth_day": null,
        'friends_list': []
    },
    'events': {
        "notification": [],
        'general': {
            'join': [],
            'subscribe': [],
            'interest': []
        },
        'admin': {
            'event': [],
            'channel': []
        }
    }
}
*/

export default ( state = initalState, action ) => {
    switch (action.type) {
        case GET_USER_INFO:
            const info = {};
            Object.keys(action.payload).filter(
                (key) => inMeta.indexOf(key) === -1
            ).forEach(
                (key) => info[key] = action.payload[key]
            );

            return ({
                ...state,
                'meta': {
                    'id': action.payload._id,
                    'facebookId': action.payload.facebookId,
                    'firstName': action.payload.firstName,
                    'lastName': action.payload.lastName,
                    'picture': action.payload.picture,
                    'picture_200px': action.payload.picture_200px,
                    'email': state.meta.email
                },
                'info': {
                    ...state.info,
                    ...info
                },
                'events': {
                    ...state.events,
                    'general': {
                        ...state.events.general,
                        'join': action.payload.join_events,
                    },
                    'admin': {
                        ...state.events.admin,
                        'channel': action.payload.admin_channels,
                        'event': action.payload.admin_events
                    }
                },
                'refObj': action.payload
            });
        case UPDATE_USER_EVENTS_INFO_JOIN:
            //Expected to update all three fields
            /* Format
            {
                'join': [],
                'subscribe': [],
                'interest': [],
                notification: []
            }
            */

            const new_general_1 = (state.events && state.events.general) ? {
                ...state.events.general,
                'join': action.payload.join
            } : {
                'join': action.payload.join
            }

            return ({
                ...state,
                'events': {
                    ...state.events,
                    'general': new_general_1
                },
                'notification': action.payload.notification
            });
        case UPDATE_USER_EVENTS_INFO_INTEREST:
            const new_general_2 = (state.events && state.events.general) ? {
                ...state.events.general,
                'interest': action.payload.interest
            } : {
                'interest': action.payload.interest
            }

            return ({
                ...state,
                'events': {
                    ...state.events,
                    'general': new_general_2
                },
                'notification': action.payload.notification
            });
        case UPDATE_USER_EVENTS_INFO_SUBSCRIBE:
            const new_general_3 = (state.events && state.events.general) ? {
                ...state.events.general,
                'subscribe': action.payload.subscribe
            } : {
                'subscribe': action.payload.subscribe
            }

            return ({
                ...state,
                'events': {
                    ...state.events,
                    'general': new_general_3
                },
                'notification': action.payload.notification
            });
        case UPDATE_USER_ADMIN_INFO:
            //Expected to update all two fields
            /* Format
            {
                'event': [],
                'channel': [],
                notification: []
            }
            */
            return ({
                ...state,
                'events': {
                    ...state.events,
                    'admin': {
                        'event': action.payload.event,
                        'channel': action.payload.channel
                    },
                    'notification': action.payload.notification
                }
            });
        case FB_FETCH_BASIC_INFO: //get email
            return ({
                ...state,
                'meta': {
                    ...state.meta,
                    'email': action.payload.email
                }
            });
        case FB_FETCH_USERS_FRIENDS_LIST:
            return ({
                ...state,
                'info': {
                    ...state.info,
                    'friends_list': action.payload.data
                }
            });
        case UPDATE_USER_FRIENDS_INFO:
            return ({
                ...state,
                'info': {
                    ...state.info,
                    'friends_list': action.payload
                }
            });
        default:
            return state;
    }
}
