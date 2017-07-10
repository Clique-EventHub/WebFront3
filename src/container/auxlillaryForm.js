import axios from 'axios';
import { getCookie } from '../actions/common';
import { hostname } from '../actions/index';

export function getForm(form_id, option) {
    if(option) {
        let config = {
            'headers': {
                'Authorization': ('JWT ' + getCookie('fb_sever_token'))
            }
        }

        if(option.useAuthorize) {
            axios.get(`${hostname}form?id=${form_id}`, config).then((data) => {
                if(typeof(option.callbackDone) === "function") option.callbackDone(data.data);
                return true;
            }, (error) => {
                if(typeof(option.callbackError) === "function") option.callbackError(error);
                return false;
            });
        } else {
            axios.get(`${hostname}form?id=${form_id}`).then((data) => {
                if(typeof(option.callbackDone) === "function") option.callbackDone(data.data);
                return true;
            }, (error) => {
                if(typeof(option.callbackError) === "function") option.callbackError(error);
                return false;
            });
        }

    }
    return false;
}

export function CreateFrom(bodyData, option) {
    let config = {
        'headers': {
            'Authorization': ('JWT ' + getCookie('fb_sever_token'))
        }
    }
    axios.post(`${hostname}form`, bodyData, config).then((response) => {
        if(option && typeof(option.callbackDone) === "function") option.callbackDone(response);
        return true;
    }, (error) => {
        if(option && typeof(option.callbackError) === "function") option.callbackError(response);
        return false;
    })
}

export function EditForm(bodyData, option) {
    return CreateFrom(bodyData, option);
}

export function saveResponse(form_id, responseBody, option) {
    let config = {
        'headers': {
            'Authorization': ('JWT ' + getCookie('fb_sever_token'))
        }
    }
    axios.put(`${hostname}form?id=${form_id}`, responseBody, config).then((response) => {
        if(option && typeof(option.callbackDone) === "function") option.callbackDone(response);
        return true;
    }, (error) => {
        if(option && typeof(option.callbackError) === "function") option.callbackError(response);
        return false;
    })
}

export function deleteForm(form_id, option) {
    let config = {
        'headers': {
            'Authorization': ('JWT ' + getCookie('fb_sever_token'))
        }
    }
    axios.delete(`${hostname}form`, config).then((response) => {
        if(option && typeof(option.callbackDone) === "function") option.callbackDone(response);
        return true;
    }, (error) => {
        if(option && typeof(option.callbackError) === "function") option.callbackError(response);
        return false;
    })
}
