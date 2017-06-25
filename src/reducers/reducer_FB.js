import { FB_LOGIN, FB_LOGOUT, FB_FETCH_BASIC_INFO, FB_FETCH_USERS_FRIENDS_LIST, FB_CLEAR, FB_UPDATE_STATUS, FB_GET_TOKEN } from '../actions/types';

const initalState = {
    isLogin : false,
    basic_info : {
        id : null,
        name : null,
        email : null
    },
    authResponse : {
        accessToken : null,
        expiresIn : null,
        grantedScopes : null,
        signedRequest : null,
        userID : null
    },
    user_friends : [],
    serverAccessToken : null,
    status : null
}

export default ( state = initalState, action ) => {
    switch (action.type) {
        case FB_LOGIN:
            if(action.payload.authResponse) {
                return ({
                    ...state,
                    isLogin : true,
                    authResponse : {
                        accessToken : action.payload.authResponse.accessToken,
                        expiresIn : action.payload.authResponse.expiresIn,
                        grantedScopes : action.payload.authResponse.grantedScopes,
                        signedRequest : action.payload.authResponse.signedRequest,
                        userID : action.payload.authResponse.userID
                    },
                    status : action.payload.status
                });
            }
            return {...state}
        case FB_LOGOUT:
            return ({
                ...initalState
            });
        case FB_CLEAR:
            return ({
                ...initalState,
                isLogin : state.isLogin
            });
        case FB_FETCH_BASIC_INFO:
            return ({
                ...state,
                basic_info : {
                    id : action.payload.id,
                    name : action.payload.name,
                    email : action.payload.email
                }
            });
        case FB_FETCH_USERS_FRIENDS_LIST:
            return ({
                ...state,
                user_friends : action.payload.data
            });
        case FB_UPDATE_STATUS:
            return ({
                ...state,
                status: action.payload
            });
        case FB_GET_TOKEN:
            return ({
                ...state,
                serverAccessToken: action.payload
            });
        default:
            return state;
    }
}
