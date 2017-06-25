/* eslint-disable */

import React, { Component } from 'react';
import TopNavBar from '../container/topNavBar';
import HomePage from '../pages/homePage';
import SideMenu from './sideMenu';

import LoginPage from '../pages/loginPage';
import $ from 'jquery';
import autoBind from '../hoc/autoBind';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            FB: null
        }
    }

    componentWillMount() {

        let _this = this;

        window.fbAsyncInit = function() {
            FB.init({
                appId      : '1815229955284405',
                xfbml      : true,
                status     : true,
                cookie     : true,
                version    : 'v2.8'
            });
            _this.setState({
                ...(_this.state),
                FB: FB
            });
            _this.props.setFBVariable(FB);
            FB.AppEvents.logPageView();
        };

        (function(d, s, id){
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

    }

    render() {
        return (
            <section>
                {this.props.children}
            </section>
        );
    }
}

export default autoBind(App, false, ["setFBVariable"], ["pages"]);

/*
HomePage

<div>
    <SideMenu />
    <div className="content-move-inactive">
        <HomePage />
        <TopNavBar />
    </div>
</div>
*/
