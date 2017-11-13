import axios from 'axios';
import { hostname } from './index';
import { myStore, googleAPI } from '../index';
import * as types from './types';
import * as actions from './index'
import _ from 'lodash';
import { getCodeList, findInfoById } from './facultyMap';

const intervalTime = 200;

export const fieldsToIconFiles = {
    "firstName" : "icon.svg",
    "lastName" : "icon.svg",
    "firstNameTH" : "icon.svg",
    "lastNameTH": "icon.svg",
    "nick_name" : "icon.svg",
    "gender" : "icon.svg",
    "email": "icon.svg",
    "birth_day" : "icon6.svg",
    "major" : "icon5.svg",
    "regId" : "icon3.svg",
    "shirt_size" : "icon11.svg",
    "allergy" : "icon13.svg",
    "disease" : "icon12.svg",
    "lineId" : "icon8.svg",
    "twitterUsername": "icon.svg",
    "phone" : "icon10.svg",
    "dorm_room" : "icon14.svg",
    "dorm_building" : "icon14.svg",
    "dorm_bed" : "icon14.svg",
    "picture" : "icon2.svg",
    "picture_200px" : "icon2.svg"
}

export const ServerToClientFields = {
    "firstName" : "FIRSTNAME (EN)",
    "lastName" : "LASTNAME (EN)",
    "firstNameTH" : "FIRSTNAME (TH)",
    "lastNameTH": "LASTNAME (TH)",
    "nick_name" : "NICKNAME",
    "gender" : "GENDER",
    "email": "E-MAIL",
    "birth_day" : "BIRTHDAY",
    "major" : "MAJOR",
    "regId" : "REG ID",
    "shirt_size" : "T-SHIRT SIZE",
    "allergy" : "FOOD ALLERGIES",
    "disease" : "MEDICAL PROBLEM",
    "lineId" : "LINE ID",
    "twitterUsername": "TWITTER ID",
    "phone" : "MOBILE NUMBER",
    "dorm_room" : "DORM ROOM",
    "dorm_building" : "DORM BUILDING",
    "dorm_bed" : "DORM BED",
    "picture" : "PICTURE (SMALL)",
    "picture_200px" : "PICTURE (LARGE)"
}

export const ClientToServerFields = {}
Object.keys(ServerToClientFields).forEach((key) => {
    ClientToServerFields[ServerToClientFields[key]] = key;
})

export const optionYear = [
    "ALL",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8"
]

export const optionFaculty = getCodeList().map((item) => {
    return findInfoById(item).FullName
});

export function clone(obj) {
    if (null === obj || "object" !== typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

export function filterKeyOut(initialObject, arrayOfKeys) {
    //actions.requestActionList
    let newObj = clone(initialObject);
    if(typeof(arrayOfKeys) !== "undefined" && arrayOfKeys.length > 0) {
        arrayOfKeys.map((item) => {
            delete newObj[item];
            return null;
        });
    }
    return newObj;
}

export function filterKeyIn(initialObject, arrayOfKeys) {
    //actions.requestActionList
    let newObj = {};
    if(typeof(arrayOfKeys) !== "undefined" && arrayOfKeys.length > 0) {
        arrayOfKeys.map((item) => {
            newObj[item] = initialObject[item];
            return null;
        });
    }
    return newObj;
}

export function mergeObjectWithKeys(objectToBeMerged, objectToMergeWith, arrayOfKeys) {
    let newObj = clone(objectToBeMerged);
    if(typeof(arrayOfKeys) !== "undefined" && arrayOfKeys.length > 0) {
        arrayOfKeys.map((item) => {
            newObj[item] = objectToMergeWith[item];
            return null;
        });
    }
    return newObj;
}

export function setCookie(cname, cvalue, expireInterval) {
    var d = new Date();
    d.setTime(d.getTime() + expireInterval);
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

export function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    //expire auto delete
    return "";
}

export function clearAllCookie() {
    document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
}

export function getRandomShade() {
    let allShade = ["blue", "green", "red", "pink", "yellow"];
    return `shade-${allShade[Math.floor(Math.random() * (4 - 0 + 1)) + 0]}`;
}

export function getEventThumbnail(eventId, options) {
    if(options.isUseAuthorize) {
        let config = {
            'headers': {
                'Authorization': ('JWT ' + getCookie('fb_sever_token'))
            }
        }
        axios.get(`${hostname}event?id=${eventId}&stat=false`, config).then((data) => {
            if(typeof(options.onSuccess) === "function") options.onSuccess(data.data);
        }, (error) => {
            if(typeof(options.onError) === "function") options.onError(error);
        });
    } else {
        axios.get(`${hostname}event?id=${eventId}&stat=false`).then((data) => {
            if(typeof(options.onSuccess) === "function") options.onSuccess(data.data);
        }, (error) => {
            if(typeof(options.onError) === "function") options.onError(error);
        });
    }
}

export function getChannelThumbnail(channelId, options) {
    if(options.isUseAuthorize) {
        let config = {
            'headers': {
                'Authorization': ('JWT ' + getCookie('fb_sever_token'))
            }
        }
        axios.get(`${hostname}channel?id=${channelId}&stat=false`, config).then((data) => {
            if(typeof(options.onSuccess) === "function") options.onSuccess(data.data);
        }, (error) => {
            if(typeof(options.onError) === "function") options.onError(error);
        });
    } else {
        axios.get(`${hostname}channel?id=${channelId}&stat=false`).then((data) => {
            if(typeof(options.onSuccess) === "function") options.onSuccess(data.data);
        }, (error) => {
            if(typeof(options.onError) === "function") options.onError(error);
        });
    }
}

export function afterSlash(str) {
    if(typeof(str) !== "string") return "";
    return str.slice(str.indexOf('/')+1, str.length);
}

export function objModStr(obj,is, value) {
    if (typeof is == 'string')
        return objModStr(obj,is.split('.'), value);
    else if (is.length == 1 && value!==undefined)
        return obj[is[0]] = value;
    else if (is.length == 0)
        return obj;
    else
        return objModStr(obj[is[0]],is.slice(1), value);
}

export function getEvent(id, stat) {
    const eventMap =  myStore.getState().map.events;
    const useStat = stat ? stat : false;
    return new Promise((resolve, reject) => {
        if(typeof eventMap[id] === "undefined") {
            if(actions.checkEvent(id)) {
                axios.get(`${hostname}event?id=${id}&stat=${useStat}`, {
                    crossDomain: true
                }).then(
                    (data) => resolve(data.data)
                ).catch((e) => reject(e))
            } else {
                const checkAvalible = setInterval(() => {
                    if(myStore.getState().map.events[id]) {
                        clearInterval(checkAvalible);
                        return resolve(myStore.getState().map.events[id]);
                    }
                }, intervalTime)
            }
        } else {
            resolve(eventMap[id])
        }
    })
}

export function forceUpdateEvent(id, stat) {
    const useStat = stat ? stat : false;
    return new Promise((resolve, reject) => {
        axios.get(`${hostname}event?id=${id}&stat=${useStat}`, {
            crossDomain: true
        }).then(
            (data) => data.data
        ).then((data) => {
            myStore.dispatch({
                type: types.UPDATE_EVENT_MAP,
                payload: data
            })
            resolve(data)
        }).catch((e) => reject(e))
    })
}

export function getChannel(id, stat) {
    const channelMap = myStore.getState().map.channels;
    const useStat = stat ? stat : false;
    return new Promise((resolve, reject) => {
        if(typeof channelMap[id] === "undefined") {
            if(actions.checkChannel(id)) {
                axios.get(`${hostname}channel?id=${id}&stat=${useStat}`).then(
                    (data) => resolve(data.data)
                ).catch((e) => reject(e))
            } else {
                const checkAvalible = setInterval(() => {
                    if(myStore.getState().map.channels[id]) {
                        clearInterval(checkAvalible);
                        return resolve(myStore.getState().map.channels[id]);
                    }
                }, intervalTime)
            }
        } else {
            resolve(channelMap[id])
        }
    })
}

export function forceUpdateChannel(id, stat) {
    const useStat = stat ? stat : false;
    return new Promise((resolve, reject) => {
        axios.get(`${hostname}channel?id=${id}&stat=${useStat}`, {
            crossDomain: true
        }).then(
            (data) => data.data
            ).then((data) => {
                myStore.dispatch({
                    type: types.UPDATE_CHANNEL_MAP,
                    payload: data
                })
                resolve(data)
            }).catch((e) => reject(e))
    })
}

export function compareArray(array1, array2) {
    if (array1.length === array2.length) {
        let isSame = true;
        for (let i = 0; i < array1.length; i++) {
            if (array1[i] !== array2[i]) {
                isSame = false;
                break;
            }
        }
        return isSame;
    }
    return false;
}

export function getUserIdInfo(mongoId) {
    const userMap = myStore.getState().map.users;
    return new Promise((resolve, reject) => {
        if (typeof userMap[mongoId] === "undefined") {
            if (actions.checkUserMongoInfo(mongoId)) {
                axios.get(`${hostname}findmg?user=${mongoId}`).then(
                    (data) => resolve(data.data.user_info)
                ).catch((e) => reject(e))
            } else {
                const checkAvalible = setInterval(() => {
                    if (myStore.getState().map.users[mongoId]) {
                        clearInterval(checkAvalible);
                        return resolve(myStore.getState().map.users[mongoId]);
                    }
                }, intervalTime)
            }
        } else {
            resolve(userMap[mongoId])
        }
    })
}

export function getUserInfo() {
    const userStore = myStore.getState().user;
    const serverToken = getCookie("fb_sever_token");
    return new Promise((resolve, reject) => {
        if(userStore.refObj !== null) resolve(userStore.refObj);
        const checkToken = setInterval(() => {
            if(getCookie("fb_sever_token") !== "") {
                clearInterval(checkToken);

                const config = {
                    'headers': {
                        'Authorization': ('JWT ' + getCookie("fb_sever_token")),
                        'crossDomain': true,
                    }
                }

                if(userStore.refObj === null) {
                    axios.get(`${hostname}user`, config).then((data) => {

                        return resolve(data.data);
                    }).catch((e) => {
                        return reject(e);
                    });
                } else {
                    return resolve(userStore.refObj);
                }
            }
        }, intervalTime);
    })
}

export function checkIsJoin(eventId) {
    const userStore = myStore.getState().user;
    return (_.get(userStore, 'events.general.join', []).indexOf(eventId) !== -1)
}

export function checkAdmin(id) {
    const userStore = myStore.getState().user;
    return (_.get(userStore, 'events.admin.event', []).concat(_.get(userStore, 'events.admin.channel', [])).indexOf(id) !== -1)
}

export function getTags() {
    return new Promise((resolve, reject) => {
        resolve({
            'Platform': [
                'CAMP',
                'WORKSHOP',
                'TALK',
                'EXHIBITION',
                'STAFF-RECRUIT',
                'VOLUNTEER',
                'CONTEST',
                'THEATRE',
                'FIRSTMEET',
                'RELIGION',
                'OPENING'
            ],
            'Content': [
                'ARTS',
                'MUSIC',
                'BUSINESS',
                'TECHNOLOGY',
                'SPORT',
                'CHARITY',
                'ACADEMIC',
                'CAREER',
                'EDUCATION',
                'NATURAL',
                'HEALTH',
                'FOOD&DRINK'
            ]
        })
    })
}

export function dateToFormat(date, option) {
    if(date) {
        let nDate = new Date(date).toString()
        let refDate = new Date(date)
        if(option === 1) return nDate.slice(0, 3) + ", " + nDate.slice(8, 10) + " " + nDate.slice(4, 7) + " " + nDate.slice(11,15)
        if(option === 2) return refDate.getDate() + "/" + (refDate.getMonth() + 1) + "/" + refDate.getFullYear()
        if(option === 3) return refDate.getDate() + "/" + (refDate.getMonth() + 1) + "/" + String(refDate.getFullYear()).slice(2,4)
        return nDate.slice(8, 10) + " " + nDate.slice(4, 7) + " " + nDate.slice(11,15)
    }
    return "No Info";
}

export function toNormString(date) {
    date = new Date(date);
    return date.toString().slice(8, 10) + ' ' + date.toString().slice(4,7) + ' ' + date.toString().slice(11,15);
}

export function shortenRangeDate(date1, date2) {
    if(date1 && date2 && new Date(date1).toString() !== "Invalid Date" && new Date(date2).toString() !== "Invalid Date") {

        let dateStart = (new Date(date1) <= new Date(date2)) ? new Date(date1) : new Date(date2);
        let dateEnd = (new Date(date2) > new Date(date1)) ? new Date(date2) : new Date(date1);
        let dateString = '';

        if(dateStart.toISOString().slice(0,10) === dateEnd.toISOString().slice(0,10)) dateString = toNormString(dateStart);
        else if(dateStart.getMonth() === dateEnd.getMonth() && dateStart.getFullYear() === dateEnd.getFullYear()) dateString = dateStart.toString().slice(8, 10) + ' - ' + toNormString(dateEnd);
        else if(dateStart.getFullYear() === dateEnd.getFullYear()) dateString = toNormString(dateStart).slice(0, 6) + ' - ' + toNormString(dateEnd);
        else dateString = toNormString(dateStart) + ' - ' + toNormString(dateEnd);

        return dateString;
    }
    return ''
}

export function checkYoutubeUrl(youtubeId) {
    return axios.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${youtubeId}&key=${googleAPI}`).then(
        (data) => {
            return parseInt(data.data.pageInfo.totalResults, 10) > 0
        }).catch(() => {
            return false;
        });
}

/*
*   arrayOfFuncPromises is array of function which return a promise
*   for example: () => Promise.resolve(() => "a")
*/

export function promiseSerial(arrayOfFuncPromises) {
    function isPromise(x) {
        return x && Object.prototype.toString.call(x) === "[object Promise]"
    }

    function validateForm(array) {
        for (let i = 0; i < array.length; i++) {
            if (typeof array[i] !== "function") {
                return false
            }
        }
        return true;
    }

    if (validateForm(arrayOfFuncPromises)) {
        return arrayOfFuncPromises.reduce((promise, func) => {
            if (typeof promise === "function") {
                if (typeof func === "function") {
                    return promise().then((result) => Promise.resolve(func()).then(Array.prototype.concat.bind(result)))
                }
            } else if (isPromise(promise)) {
                if (typeof func === "function") {
                    return promise.then((result) => Promise.resolve(func()).then(Array.prototype.concat.bind(result)))
                }
            }
        }, Promise.resolve([]))
    }
    return Promise.reject("Incorrect format");
}


export function getAuthorizationConfig() {
    return {
        'headers': {
            'Authorization': ('JWT ' + getCookie("fb_sever_token")),
            'crossOrigin': true
        }
    }
}