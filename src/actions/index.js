import { myStore } from '../index';
import * as types from './types';
import axios from 'axios';
import { setCookie, getCookie, clearAllCookie } from './common';
import * as facultyMap from './facultyMap';
import _ from 'lodash';

//myStore.getState()

// const hostname = "https://api.cueventhub.com/";
export const hostname = "https://api.cueventhub.com/";
export const urlName = "http://localhost:3000/#/";
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
            'Authorization': ('JWT ' + getCookie('fb_sever_token')),
            'crossDomain': true
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

function updateActivities(dispatch) {

    requestWithAuthorization(`${hostname}user/join`, {
        'method': 'get'
    }).then((res) => {
        //join: res.data[Object.keys(res.data).filter((key) => key !== "notification")],
        dispatch({
            type: types.UPDATE_USER_EVENTS_INFO_JOIN,
            payload: {
                join: res.data[Object.keys(res.data).filter((key) => key !== "notification")].map((item) => item[Object.keys(item)].event_id),
                notification: res.data.notification
            }
        })
    })

    requestWithAuthorization(`${hostname}user/interest`, {
        'method': 'get'
    }).then((res) => {
        dispatch({
            type: types.UPDATE_USER_EVENTS_INFO_INTEREST,
            payload: {
                interest: res.data[Object.keys(res.data).filter((key) => key !== "notification")].map((item) => item[Object.keys(item)].event_id),
                notification: res.data.notification
            }
        })
    })

    requestWithAuthorization(`${hostname}user/subscribe`, {
        'method': 'get'
    }).then((res) => {
        console.log(res.data);
        console.log();
        dispatch({
            type: types.UPDATE_USER_EVENTS_INFO_SUBSCRIBE,
            payload: {
                subscribe: Object.keys(res.data).filter((key) => key !== "notification").map((key) => res.data[key].channel_id),
                notification: res.data.notification
            }
        })
    })

}

window.getCookie = getCookie;
window.setCookie = setCookie;
window.clearCookie = clearAllCookie;

/*
// let tmp = [
//     requestWithAuthorization(`${hostname}user/join`, {
//         'method': 'get'
//     }),
//     requestWithAuthorization(`${hostname}user/interest`, {
//         'method': 'get'
//     }),
//     requestWithAuthorization(`${hostname}user/subscribe`, {
//         'method': 'get'
//     })
// ];
//
// Promise.all(tmp).then((datas) => {
//     let noti = [datas[0].data.notification, datas[1].data.notification, datas[2].data.notification];
//     let rNoti = [];
//     if(noti[0] == noti[1] && noti[1] == noti[2]) rNoti = noti[0];
//     else {
//         if(noti[0] == noti[1]) rNoti = noti[0];
//         else if(noti[1] == noti[2]) rNoti = noti[1];
//         else if(noti[0] == noti[2]) rNoti = noti[2];
//     }
//
//     dispatch({
//         type: types.UPDATE_USER_EVENTS_INFO,
//         payload: {
//             join: datas[0].data[Object.keys(datas[0].data).filter((key) => key !== "notification")],
//             subscribe: datas[1].data[Object.keys(datas[1].data).filter((key) => key !== "notification")],
//             interest: datas[2].data[Object.keys(datas[2].data).filter((key) => key !== "notification")],
//             notification: rNoti
//         }
//     })
// })
*/

function init_user_info(dispatch) {
    requestWithAuthorization(`${hostname}user`, {
        'method': 'get',
    }).then((data) => {
        dispatch({
            type: types.GET_USER_INFO,
            payload: data.data
        })
    });

    Promise.all([
        requestWithAuthorization(`${hostname}user/show-admin-channels`, {
            'method': 'get'
        }),
        requestWithAuthorization(`${hostname}user/show-admin-events`, {
            'method': 'get'
        })
    ]).then((results) => {
        dispatch({
            type: types.UPDATE_USER_ADMIN_INFO,
            payload: {
                channel: _.get(results[0], 'data.channels', []).map((item) => item.channel_id),
                event: _.get(results[1], 'data.event_info', []).map((item) => item.event_id)
            }
        })
    })
    updateActivities(dispatch);
}

export function setFBVariable(_FB) {
    // console.log(facultyMap.findInfoByName("นิเทด"));
    return (dispatch) => {
        dispatch({
            type: types.SET_FB_VARIABLE,
            payload: _FB
        });

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

                dispatch({
                    type: types.FB_FETCH_BASIC_INFO,
                    payload: rObj_1
                });

                dispatch({
                    type: types.FB_LOGIN,
                    payload: rObj_2
                });

                fbUpdateStatus(dispatch).then(() => {
                    fbGetBasicInfo(dispatch);
                    if(getCookie("fb_sever_token") === "") {
                        fbGetSeverToken(dispatch).then(() => {
                            init_user_info(dispatch);
                            fbGetFriendsList(dispatch);
                        });
                    } else {
                        init_user_info(dispatch);
                        fbGetFriendsList(dispatch);
                    }
                })
            }, 0);
        };

    }
}

function updateAllFriendsInfo(dispatch) {
    const FB = myStore.getState().pages.FB;
    const fb = myStore.getState().fb;
    if(FB && fb.user_friends.length > 0) {
        let tmp = fb.user_friends.map((info) => {
            return new Promise((resolve, reject) => {

                axios.get(`${hostname}findfb?user=${info.fb.id}`, { headers: {'crossDomain': true}}).then((data) => {
                    resolve({
                        ...info,
                        server: {...data.data.user_info},
                        isError: false
                    });
                }).catch((error) => {
                    resolve({
                        ...info,
                        server: {...error},
                        isError: true
                    });
                });
            })
        });

        Promise.all(tmp).then((datas) => {
            let isError = true;
            for(let i = 0; i < datas.length && isError; i++) {
                isError = datas[i].isError;
            }
            if(isError) {
                setTimeout(() => {
                    let tmp2 = fb.user_friends.map((info) => {
                        return new Promise((resolve, reject) => {
                            axios.get(`${hostname}findfb?user=${info.fb.id}`, {headers: {'crossDomain': true}}).then((data) => {
                                resolve({
                                    ...info,
                                    server: {...data.data.user_info},
                                    isError: false
                                });
                            }).catch((error) => {
                                resolve({
                                    ...info,
                                    server: {...error},
                                    isError: true
                                });
                            });
                        })
                    });

                    Promise.all(tmp2).then((datas) => {
                        // console.log(datas);
                        dispatch({
                            type: types.UPDATE_USER_FRIENDS_INFO,
                            payload: datas
                        })
                    });
                }, 1200);
            } else {
                // console.log(datas);
                dispatch({
                    type: types.UPDATE_USER_FRIENDS_INFO,
                    payload: datas
                })
            }
        })
    }
}

//

function fbUpdateStatus(dispatch) {
    const FB = myStore.getState().pages.FB;
    return new Promise((resolve, reject) => {
        if(FB) {
            FB.getLoginStatus((res) => {
                dispatch({
                    type: types.FB_UPDATE_STATUS,
                    payload: res.status
                });
                resolve(true);
            })
        }
        else reject(false);
    })
}

export function fbClearInfo() {
    return ({
        type: types.FB_CLEAR,
        payload: null
    })
}

export function fbLogin(callback) {
    return (dispatch) => {
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

                    dispatch({
                        type: types.FB_LOGIN,
                        payload: res
                    });

                    if(getCookie("fb_sever_token") === "") {
                        fbGetSeverToken(dispatch).then(() => {
                            init_user_info(dispatch);
                            fbGetFriendsList(dispatch);
                        });
                    }
                }
                //if(typeof(callback) === "function") callback();
            }, {
                scope: 'user_friends,email,public_profile',
                return_scopes: true
            });
        }
    }
}

export function fbLogout() {
    return (dispatch) => {
        const FB = myStore.getState().pages.FB;
        if(FB && myStore.getState().fb.isLogin) {
            FB.logout((res) => {
                if(res.status === "unknown") {
                    dispatch({
                        type: types.FB_LOGOUT,
                        payload: res
                    });
                    clearAllCookie();
                }
                fbUpdateStatus(dispatch);
            });
        }
    }
}

function fbGetBasicInfo(dispatch) {
    const FB = myStore.getState().pages.FB;
    if(FB) {
        fbUpdateStatus(dispatch);
        FB.api('/me', { locale: 'en_US', fields: 'name, email' },  (res) => {
            dispatch({
                type: types.FB_FETCH_BASIC_INFO,
                payload: res
            });
            Object.keys(res).forEach((item) => {
                setCookie(`fb_basic_info_${item}`, res[item], expireDefaultInterval);
            });
        });
    }
}

function fbGetFriendsList(dispatch) {
    const FB = myStore.getState().pages.FB;
    if(FB) {
        fbUpdateStatus(dispatch);
        const fbat = getCookie("fb_accessToken");

        FB.api(`/me/friends?access_token=${fbat}&fields=id,name,gender,link,picture.width(200).height(200)&type=large`,  (res) => {
            if(res.data) {
                dispatch({
                    type: types.FB_FETCH_USERS_FRIENDS_LIST,
                    payload: {data: res.data.map((item) => {return {fb: item, isError: false, server: null}})}
                });
                updateAllFriendsInfo(dispatch);
            }
        });
    }
}

export function fbGetSeverToken(dispatch) {
    const FB = myStore.getState().pages.FB;
    const fb = myStore.getState().fb;
    return new Promise((resolve, reject) => {
        if(FB && fb.status === "connected") {
            axios.get(`${hostname}login/facebook?access_token=${myStore.getState().fb.authResponse.accessToken}&id=${myStore.getState().fb.authResponse.userID}`, {headers: {'crossDomain': true}}).then((res) => {
                setCookie(`fb_sever_token`, res.data.access_token, expireDefaultInterval);
                dispatch({
                    type: types.FB_GET_TOKEN,
                    payload: res.data.access_token
                });
                resolve(true);
            }).catch((err) => {
                console.log(err);
                console.log(err.toString());
            })
        } else {
            dispatch({
                type: types.FB_GET_TOKEN,
                payload: null
            });
            reject(false);
        }
    })
}

//

let alreadyCalled = {
    events: {},
    channels: {},
    users: {}
}

export function checkEvent(id) {
    const map = myStore.getState().map;
    if(_.get(alreadyCalled.events, `${id}`, false)) return false;
    if(typeof map.events[id] === "undefined") {
        alreadyCalled.events[id] = true;
        axios.get(`${hostname}event?id=${id}&stat=false`).then(
            (data) => data.data
        ).then((data) => {
            if(typeof myStore.getState().map.events[id] === "undefined") {
                myStore.dispatch({
                    type: types.UPDATE_EVENT_MAP,
                    payload: data
                })
            }
        })
    }
    return true;
}

export function checkChannel(id) {
    const map = myStore.getState().map;
    if(_.get(alreadyCalled.channels, `${id}`, false)) return false;
    if(typeof map.channels[id] === "undefined") {
        alreadyCalled.channels[id] = true;
        axios.get(`${hostname}channel?id=${id}&stat=false`).then(
            (data) => data.data
        ).then((data) => {
            if(typeof myStore.getState().map.channels[id] === "undefined") {
                myStore.dispatch({
                    type: types.UPDATE_CHANNEL_MAP,
                    payload: data
                })
            }
        })
    }
    return true;
}

export function checkUserMongoInfo(id) {
    const map = myStore.getState().map;
    if (_.get(alreadyCalled.users, `${id}`, false)) return false;
    if (typeof map.users[id] === "undefined") {
        alreadyCalled.users[id] = true;
        axios.get(`${hostname}findmg?user=${id}`).then(
            (data) => data.data.user_info
        ).then((data) => {
            if (typeof myStore.getState().map.users[id] === "undefined") {
                myStore.dispatch({
                    type: types.UPDATE_USER_MAP,
                    payload: data
                })
            }
        })
    }
    return true;
}

//

// export function getEvent(id) {
//     const rObj = request(`${hostname}event?id=${id}`, "get", types.GET_EVENT);
//     return rObj.action;
// }
//
// export function searchEvent(keyword) {
//     const rObj = request(`${hostname}event/search?keyword=${keyword}`, "get", types.SEARCH_EVENT_KEYWORD);
//     return rObj.action;
// }
//
// export function searchChannel(keyword) {
//     const rObj = request(`${hostname}listAll`, "get", types.SEARCH_CHANNEL_KEYWORD);
//     return rObj.action;
// }
//
// export function searchEventTag(tags) {
//     //tags is array of string tag
//     let searchWord = "";
//     tags.map((tag, index) => {
//         if(index !== tags.length-1) searchWord += tag + ",";
//         else searchWord += tag;
//         return null;
//     });
//     const rObj = request(`${hostname}tags/search?keywords=${searchWord}`, "get", types.SEARCH_EVENT_TAG);
//     return rObj.action;
// }
//
// export function searchByDate(startDate, endDate) {
//     const rObj = request(`${hostname}event/searchbydate?date_start=${startDate}&date_end=${endDate}`, "get", types.SEARCH_BY_DATE);
//     return rObj.action;
// }
//
// export function getNewEvent(top) {
//     let rObj = null;
//     if(top !== null && top >= 1) {
//         rObj = request(`${hostname}event/new?top=${top}`, "get", types.FETCH_NEW_EVENT);
//     }
//     else {
//         rObj = request(`${hostname}event/new`, "get", types.FETCH_NEW_EVENT);
//     }
//     return rObj.action;
// }
//
// export function getAllEvent() {
//     const rObj = request(`${hostname}listAll`, "get", types.FETCH_ALL_EVENTS);
//     return rObj.action;
// }
//
// export function getAllChannel() {
//     const rObj = request(`${hostname}channel/listAll`, "get", types.FETCH_ALL_CHANNELS);
//     return rObj.action;
// }
//
// export function getChannel(id) {
//     axios.get(`${hostname}channel?id=${id}`,{headers: {'crossDomain': true}}).then((channel) => {
//         var eventsPromiseAsync = [];
//
//         channel.data.events.map((event_id) => {
//             var tmp = new Promise((resolve, reject) => {
//                 axios.get(`${hostname}event?id=${event_id}`,{headers: {'crossDomain': true}}).then((data) => {
//
//                     myStore.dispatch({
//                         type: `${types.SET_EVENTS_IN_CHANNEL}_FULFILLED`,
//                         payload: data
//                     });
//
//                     resolve(data);
//                 }, (error) => {
//                     myStore.dispatch({
//                         type: `${types.SET_EVENTS_IN_CHANNEL}_REJECTED`,
//                         payload: error
//                     });
//                     reject(error);
//                 });
//             });
//
//             eventsPromiseAsync.push(tmp);
//             return null;
//
//         });
//
//         myStore.dispatch({
//             type: `${types.GET_CHANNEL}_FULFILLED`,
//             payload: channel
//         });
//
//         return channel;
//     }).catch((error) => {
//         myStore.dispatch({
//             type: `${types.GET_CHANNEL}_REJECTED`,
//             payload: error
//         })
//     });
//
//     return {
//         type: `${types.GET_CHANNEL}_PENDING`
//     };
// }

//
