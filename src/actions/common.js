import axios from 'axios';
import { hostname } from './index';

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
