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
            new Promise((res, rej) => (res(true))).then(() => {
                _this.props.setFBVariable(FB);
            })
            FB.AppEvents.logPageView();
        };

        (function(d, s, id){
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

        /**/
        /*!
        * FitText.js 1.0 jQuery free version
        *
        * Copyright 2011, Dave Rupert http://daverupert.com
        * Released under the WTFPL license
        * http://sam.zoy.org/wtfpl/
        * Modified by Slawomir Kolodziej http://slawekk.info
        *
        * Date: Tue Aug 09 2011 10:45:54 GMT+0200 (CEST)
        */

        (function(){

          var addEvent = function (el, type, fn) {
            if (el.addEventListener)
              el.addEventListener(type, fn, false);
        		else
        			el.attachEvent('on'+type, fn);
          };

          var extend = function(obj,ext){
            for(var key in ext)
              if(ext.hasOwnProperty(key))
                obj[key] = ext[key];
            return obj;
          };

          window.fitText = function (el, kompressor, options) {

            var settings = extend({
              'minFontSize' : -1/0,
              'maxFontSize' : 1/0
            },options);

            var fit = function (el) {
              var compressor = kompressor || 1;

              var resizer = function () {
                el.style.fontSize = Math.max(Math.min(el.clientWidth / (compressor*10), parseFloat(settings.maxFontSize)), parseFloat(settings.minFontSize)) + 'px';
              };

              // Call once to set.
              resizer();

              // Bind events
              // If you have any js library which support Events, replace this part
              // and remove addEvent function (or use original jQuery version)
              addEvent(window, 'resize', resizer);
              addEvent(window, 'orientationchange', resizer);
            };

            if (el.length) {
              for(var i=0; i<el.length; i++) {
                  fit(el[i]);
              }
            }
            else {
                fit(el);
            }

            // return set of elements
            return el;
          };
        })();
        /**/

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
