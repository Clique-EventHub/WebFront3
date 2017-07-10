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
