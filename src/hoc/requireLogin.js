import React, { Component } from 'react';
import FallbackPage from '../pages/FallbackPage';
// import { getCookie } from '../actions/common';
import autoBind from './autoBind';

export default function(ComposedComponent) {
    const requireLogin = (props) => {
        // if(getCookie("fb_server_token") !== "") {
        //     return <ComposedComponent />
        // }
        if(props.fb.isLogin) return <ComposedComponent {...props} />
        return <FallbackPage />;
    }

    return autoBind(requireLogin, {
        state: ["fb"],
        action: [""]
    });
}
