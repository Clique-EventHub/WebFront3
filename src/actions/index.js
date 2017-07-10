import { myStore } from '../index';
import * as types from './types';
import axios from 'axios';
import { setCookie, getCookie, clearAllCookie } from './common';
import * as facultyMap from './facultyMap';

//myStore.getState()

// const hostname = "https://api.cueventhub.com/";
export const hostname = "http://139.59.97.65:1111/";
const expireDefaultInterval = 1000*60*60*3;

export const requestActionList = [
    "getChannel", "getEvent", "searchEvent", "searchChannel",
    "searchEventTag", "searchByDate", "getNewEvent", "getAllEvent",
    "getAllChannel", "requestActionList"
];

export function blur_bg() {
    return ({
        type: types.BLUR_BG,
        payload: true
    })
}

export function unblur_bg() {
    return ({
        type: types.UNBLUR_BG,
        payload: false
    });
}

export function toggle_bg() {
    return ({
        type: types.TOGGLE_BLUR_BG,
        payload: null
    });
}

export function set_pop_up_item(props) {
    return ({
        type: types.SET_ITEM,
        payload: props
    });
}

export function reset_pop_up_item() {
    return ({
        type: types.RESET_ITEM,
        payload: null
    })
}

export function display_pop_item(props) {
    return ({
        type: types.DISPLAY_ITEM,
        payload: props
    });
}

export function hide_pop_item() {
    return ({
        type: types.HIDE_ITEM,
        payload: null
    });
}

export function toggle_pop_item() {
    return ({
        type: types.TOGGLE_ITEM,
        payload: null
    });
}

export function searched_item_handler(props) {
    return ({
        type: types.searched_item,
        payload: props
    });
}

export function selected_event_handler(props) {
    return ({
        type: types.selected_event,
        payload: props
    })
}

export function deselected_event_handler(props) {
    return ({
        type: types.deselected_event,
        payload: null
    })
}

export function forced_fix_bg() {
    return ({
        type: types.FORCED_FIX_BG,
        payload: true
    });
}

export function cancel_fix_bg() {
    return ({
        type: types.CANCEL_FIX_BG,
        payload: false
    });
}

//

function request(url, method, types) {
    let rObj = {
        isRESTFUL : false,
        action : null
    };

    let tmp;

    switch (method) {
        case "get":
        case "Get":
            rObj.isRESTFUL = true;
            rObj.action = { type: `${types}_PENDING` };

            axios[method](url).then((data) => {
                myStore.dispatch({
                    type: `${types}_FULFILLED`,
                    payload: data
                });
            }, (error) => {
                myStore.dispatch({
                    type: `${types}_REJECTED`,
                    payload: error
                })
            });
            break;
        default:
            rObj.isRESTFUL = false;
            rObj.action = {
                type: types
            };
    }
    return rObj;
}

//

function requestWithAuthorization(url, options) {
    let config = {
        'headers': {
            'Authorization': ('JWT ' + getCookie('fb_sever_token'))
        }
    }

    switch(options.method) {
        case 'get':
        case 'delete':
            return axios[options.method](url, config);
            break;
        case 'post':
        case 'put':
            return axios[options.method](url, ((options.body) ? (options.body) : ({})), config);
            break;
        default:
            return new Promise((res, rej) => {rej("Unsupported method")});
    }
}

export function init_user_info() {
    requestWithAuthorization(`${hostname}user`, {
        'method': 'get',
    }).then((data) => {
        myStore.dispatch({
            type: types.GET_USER_INFO,
            payload: data.data
        })
    });

    let tmp = [
        requestWithAuthorization(`${hostname}user/join`, {
            'method': 'get'
        }),
        requestWithAuthorization(`${hostname}user/interest`, {
            'method': 'get'
        }),
        requestWithAuthorization(`${hostname}user/subscribe`, {
            'method': 'get'
        })
    ];

    Promise.all(tmp).then((datas) => {
        let noti = [datas[0].data.notification, datas[1].data.notification, datas[2].data.notification];
        let rNoti = [];
        if(noti[0] == noti[1] && noti[1] == noti[2]) rNoti = noti[0];
        else {
            if(noti[0] == noti[1]) rNoti = noti[0];
            else if(noti[1] == noti[2]) rNoti = noti[1];
            else if(noti[0] == noti[2]) rNoti = noti[2];
        }

        myStore.dispatch({
            type: types.UPDATE_USER_EVENTS_INFO,
            payload: {
                join: datas[0].data[Object.keys(datas[0].data).filter((key) => key !== "notification")],
                subscribe: datas[1].data[Object.keys(datas[1].data).filter((key) => key !== "notification")],
                interest: datas[2].data[Object.keys(datas[2].data).filter((key) => key !== "notification")],
                notification: rNoti
            }
        })
    })
}

//

export function setFBVariable(_FB) {
    // console.log(facultyMap.findInfoByName("นิเทด"));
    if(getCookie('fb_is_login')) {
        setTimeout(function() {
            let rObj_1 = {};
            let rObj_2 = {authResponse: {}, status: "unknown"};

            ['fb_basic_info_email', 'fb_basic_info_name', 'fb_basic_info_id'].forEach((item) => {
                rObj_1[item.replace('fb_basic_info_','')] = getCookie(item);
            });

            ['fb_accessToken', 'fb_grantedScopes', 'fb_signedRequest', 'fb_userID'].forEach((item) => {
                rObj_2.authResponse[item.replace('fb_','')] = getCookie(item);
            })

            myStore.dispatch({
                type: types.FB_FETCH_BASIC_INFO,
                payload: rObj_1
            });

            myStore.dispatch({
                type: types.FB_LOGIN,
                payload: rObj_2
            });

            fbGetSeverToken();
            fbGetFriendsList();

        }, 0);
    };
    return ({
        type: types.SET_FB_VARIABLE,
        payload: _FB
    });
}

//

export function fbUpdateStatus() {
    const FB = myStore.getState().pages.FB;
    if(FB) {
        FB.getLoginStatus((res) => {
            myStore.dispatch({
                type: types.FB_UPDATE_STATUS,
                payload: res.status
            });
        })
    }
    return ({
        type: null
    });
}

export function fbClearInfo() {
    return ({
        type: types.FB_CLEAR,
        payload: null
    })
}

export function fbLogin(callback) {
    const FB = myStore.getState().pages.FB;
    if(FB) {
        FB.login((res) => {
            if(res.status === "connected") {

                Object.keys(res.authResponse).map((item) => {
                    if(item !== "expiresIn")
                        setCookie(`fb_${item}`, res.authResponse[item], res.expiresIn*1000);
                    return null;
                });

                setCookie(`fb_is_login`, true, expireDefaultInterval);

                myStore.dispatch({
                    type: types.FB_LOGIN,
                    payload: res
                });

            }
            if(typeof(callback) === "function") callback();
        }, {
            scope: 'user_friends,email,public_profile',
            return_scopes: true
        });
    }
    return {
        type: null
    };
}

export function fbLogout() {
    const FB = myStore.getState().pages.FB;
    if(FB && myStore.getState().fb.isLogin) {
        FB.logout((res) => {
            if(res.status === "unknown") {
                myStore.dispatch({
                    type: types.FB_LOGOUT,
                    payload: res
                });
                clearAllCookie();
            }
            fbUpdateStatus();
        });
    }
    return {
        type: null
    };
}

export function fbGetBasicInfo() {
    const FB = myStore.getState().pages.FB;
    if(FB) {
        fbUpdateStatus();
        FB.api('/me', { locale: 'en_US', fields: 'name, email' },  (res) => {
            myStore.dispatch({
                type: types.FB_FETCH_BASIC_INFO,
                payload: res
            });
            Object.keys(res).map((item) => {
                setCookie(`fb_basic_info_${item}`, res[item], expireDefaultInterval);
                return null;
            });
        });
    }
    return {
        type: null
    };
}

export function fbGetFriendsList() {
    const FB = myStore.getState().pages.FB;
    if(FB) {
        fbUpdateStatus();
        FB.api('/me/friends',  (res) => {
            myStore.dispatch({
                type: types.FB_FETCH_USERS_FRIENDS_LIST,
                payload: res
            });
            //console.log(res.data);
        });
    }
    return {
        type: null
    };
}

export function fbGetSeverToken(callback) {
    const FB = myStore.getState().pages.FB;
    if(FB && (myStore.getState().fb.status === "connected")) {
        axios.get(`${hostname}login/facebook?access_token=${myStore.getState().fb.authResponse.accessToken}&id=${myStore.getState().fb.authResponse.userID}`).then((res) => {
            myStore.dispatch({
                type: types.FB_GET_TOKEN,
                payload: res.data.access_token
            });
            setCookie(`fb_sever_token`, res.data.access_token, expireDefaultInterval);

            init_user_info();
            if(typeof(callback) === "function") {
                callback();
            }
        }).catch((err) => {
            console.log(err);
        })

        // myStore.dispatch({
        //     type: types.FB_GET_TOKEN,
        //     payload: null
        // });
    }
    return ({
        type: null
    });
}

//

export function getEvent(id) {
    const rObj = request(`${hostname}event?id=${id}`, "get", types.GET_EVENT);
    return rObj.action;
}

export function searchEvent(keyword) {
    const rObj = request(`${hostname}event/search?keyword=${keyword}`, "get", types.SEARCH_EVENT_KEYWORD);
    return rObj.action;
}

export function getProfile() {

}

export function searchChannel(keyword) {
    const rObj = request(`${hostname}listAll`, "get", types.SEARCH_CHANNEL_KEYWORD);
    return rObj.action;
}

export function searchEventTag(tags) {
    //tags is array of string tag
    let searchWord = "";
    tags.map((tag, index) => {
        if(index !== tags.length-1) searchWord += tag + ",";
        else searchWord += tag;
        return null;
    });
    const rObj = request(`${hostname}tags/search?keywords=${searchWord}`, "get", types.SEARCH_EVENT_TAG);
    return rObj.action;
}

export function searchByDate(startDate, endDate) {
    const rObj = request(`${hostname}event/searchbydate?date_start=${startDate}&date_end=${endDate}`, "get", types.SEARCH_BY_DATE);
    return rObj.action;
}

export function getNewEvent(top) {
    let rObj = null;
    if(top !== null && top >= 1) {
        rObj = request(`${hostname}event/new?top=${top}`, "get", types.FETCH_NEW_EVENT);
    }
    else {
        rObj = request(`${hostname}event/new`, "get", types.FETCH_NEW_EVENT);
    }
    return rObj.action;
}

export function getAllEvent() {
    const rObj = request(`${hostname}listAll`, "get", types.FETCH_ALL_EVENTS);
    return rObj.action;
}

export function getAllChannel() {
    const rObj = request(`${hostname}channel/listAll`, "get", types.FETCH_ALL_CHANNELS);
    return rObj.action;
}

export function getChannel(id) {
    axios.get(`${hostname}channel?id=${id}`).then((channel) => {
        var eventsPromiseAsync = [];

        channel.data.events.map((event_id) => {
            var tmp = new Promise((resolve, reject) => {
                axios.get(`${hostname}event?id=${event_id}`).then((data) => {

                    myStore.dispatch({
                        type: `${types.SET_EVENTS_IN_CHANNEL}_FULFILLED`,
                        payload: data
                    });

                    resolve(data);
                }, (error) => {
                    myStore.dispatch({
                        type: `${types.SET_EVENTS_IN_CHANNEL}_REJECTED`,
                        payload: error
                    });
                    reject(error);
                });
            });

            eventsPromiseAsync.push(tmp);
            return null;

        });

        myStore.dispatch({
            type: `${types.GET_CHANNEL}_FULFILLED`,
            payload: channel
        });

        return channel;
    }).catch((error) => {
        myStore.dispatch({
            type: `${types.GET_CHANNEL}_REJECTED`,
            payload: error
        })
    });

    return {
        type: `${types.GET_CHANNEL}_PENDING`
    };
}

//
