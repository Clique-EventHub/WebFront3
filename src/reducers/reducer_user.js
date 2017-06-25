import { GET_USER_INFO,
    UPDATE_USER_EVENTS_INFO,
    UPDATE_USER_ADMIN_INFO,
    FB_FETCH_BASIC_INFO,
    FB_FETCH_USERS_FRIENDS_LIST } from '../actions/types';

const initalState = {
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

export default ( state = initalState, action ) => {
    let tmp = { ...state };
    switch (action.type) {
        case GET_USER_INFO:
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
                    "gender": action.payload.gender,
                    "phone": action.payload.phone,
                    "shirt_size": action.payload.shirt_size,
                    "allergy": action.payload.allergy,
                    "disease": action.payload.disease,
                    "regId": action.payload.regId,
                    "twitterUsername": action.payload.twitterUsername,
                    "lineId": action.payload.lineId,
                    "birth_day": action.payload.birth_day,
                    'friends_list': []
                }
            });
        case UPDATE_USER_EVENTS_INFO:
            //Expected to update all three fields
            /* Format
            {
                'join': [],
                'subscribe': [],
                'interest': [],
                notification: []
            }
            */
            tmp.events.general.join = action.payload.join;
            tmp.events.general.subscribe = action.payload.subscribe;
            tmp.events.general.interest = action.payload.interest;
            tmp.events.notification = action.payload.notification;

            return ({ ...tmp });
        case UPDATE_USER_ADMIN_INFO:
            //Expected to update all two fields
            /* Format
            {
                'event': [],
                'channel': [],
                notification: []
            }
            */

            tmp.events.admin.event = action.payload.event
            tmp.events.admin.channel = action.payload.channel
            tmp.events.notification = action.payload.notification
            return ({ ...tmp });
        case FB_FETCH_BASIC_INFO: //get email
            tmp.meta.email = action.payload.email;
            return ({ ...tmp });
        case FB_FETCH_USERS_FRIENDS_LIST:
            tmp.info.friends_list = action.payload.data;
            return ({ ...tmp });
        default:
            return state;
    }
}
