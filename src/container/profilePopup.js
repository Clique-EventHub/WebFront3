import React, { Component } from 'react';
import autoBind from '../hoc/autoBind';
import axios from 'axios';
import { getCookie } from '../actions/common';
import * as facultyMap from '../actions/facultyMap';
// import { clearAllCookie } from '../actions/common';
import './css/profilePopup.css';
// import loginPage from '../pages/loginPage.js'
import { Link } from 'react-router';

class profilePopup extends Component {

    constructor(props) {
        super(props);

        this.state = {
          'isLoading': true,
          'login': false
        };

    }

    componentWillReceiveProps(nextProps) {
        this.setState({updated: nextProps.updated});
    }

    componentWillMount() {

        if(getCookie('fb_sever_token') !== ""){
            this.setState({'login': true})
            console.log("cookie : " + getCookie('fb_sever_token') );
        }

        let config = {
            'headers': {
                'Authorization': ('JWT ' + getCookie('fb_sever_token'))
            }
        }

        let _this = this;

        axios.get('http://128.199.208.0:1111/user', config).then((data) => {
            console.log("get!!!");
            console.log(JSON.stringify(data.data.firstName));
            _this.setState({
                'firstName': data.data.firstName,
                'lastName': data.data.lastName,
                'picture': data.data.picture_200px,
                'faculty': (data.data.regId === null)? '99': JSON.stringify(data.data.regId).substring(9, 11),
                'join_events': data.data.join_events,
                'notification': data.data.notification,
                'n_noti': data.data.notification.length,
                'isLoading': false
            })
            console.log("number of event : " + data.data.join_events.length);
            _this.getEvent(0);
            _this.getEvent(1);
            _this.getEvent(2);
        }, (error) => {
            console.log("get user error");
        });

        // for (var i = 0; i < this.state.join_events.length; i++) {
        //     if(i < 3){
        //         axios.get('http://128.199.208.0:1111/event?id=' + this.state.join_events[i]).then((data) => {
        //             console.log("get!!!");
        //             console.log(JSON.stringify(data.data.title))
        //             _this.setState({
        //                 'event{i}_title': data.data.title,
        //                 'event{i}_date_start': data.data.date_start,
        //             })
        //         }, (error) => {
        //             console.log("get event error");
        //         });
        //     }
        // }
    }

    getEvent(i) {
        let _this = this;

        console.log("get event : " + this.state.join_events[i]);

        if(this.state.join_events.length >= i+1){
            axios.get('http://128.199.208.0:1111/event?id=' + this.state.join_events[i]).then((data) => {
                console.log("get!!!");
                console.log(JSON.stringify(data.data.title))
                if(i === 0){
                    _this.setState({
                        'event1_title': data.data.title,
                        'event1_date_start': data.data.date_start,
                    })
                } else if (i === 1) {
                    _this.setState({
                        'event2_title': data.data.title,
                        'event2_date_start': data.data.date_start,
                    })
                } else if (i === 2) {
                    _this.setState({
                        'event3_title': data.data.title,
                        'event3_date_start': data.data.date_start,
                    })
                }

            }, (error) => {
                console.log("get event error");
            });
        }
    }

    onLogin() {
        this.props.fbLogin(this.props.fbGetSeverToken);
        this.props.fbGetBasicInfo();
        this.setState({'login': true});
        // if(getCookie('fb_sever_token') != ""){
        //     this.setState({'login': true})
        //     console.log("cookie : " + getCookie('fb_sever_token') );
        // }

        let config = {
            'headers': {
                'Authorization': ('JWT ' + getCookie('fb_sever_token'))
            }
        }

        let _this = this;

        axios.get('http://128.199.208.0:1111/user', config).then((data) => {
            console.log("get!!!");
            console.log(JSON.stringify(data.data.firstName));
            _this.setState({
                'firstName': data.data.firstName,
                'lastName': data.data.lastName,
                'picture': data.data.picture_200px,
                'faculty': (data.data.regId === null)? '99': JSON.stringify(data.data.regId).substring(9, 11),
                'join_events': data.data.join_events,
                'notification': data.data.notification,
                'n_noti': data.data.notification.length,
                'isLoading': false
            })
            console.log("number of event : " + data.data.join_events.length);
            _this.getEvent(0);
            _this.getEvent(1);
            _this.getEvent(2);
        }, (error) => {
            console.log("get user error");
        });
    }

    onLogout() {
        this.props.fbLogout();
        this.setState({'login': false})
    }

    // logout() {
    //     clearAllCookie();
    //     this.setState({'login': false})
    // }

    onExit() {
        this.props.toggle_pop_item();
    }

    render() {
        var noti_list = [];
        var noti = this.state.notification;

        for(var i = 0; i < this.state.n_noti ; i++){
            noti_list.push(<div><img src={noti[i].photo} alt="noti-icon" /><p><strong>{noti[i].source} : </strong>{noti[i].title}</p></div>);
        }

        return (
          <div>
          {(this.state.login === false) ?
            <section className="signup-page">
                <atricle className="login-card">
                    <button alt="fb-login" onClick={this.onLogin.bind(this)}>
                        <div alt="fb-icon-container">
                            <img src="../../resource/images/fb_icon.svg" alt="fb-icon" />
                        </div>
                        <div>
                            <span>
                                Sign up with Facebook
                            </span>
                        </div>
                    </button>
                    <Link to='/'>
                        Continue as guest
                    </Link>
                </atricle>
                <footer alt="login-footer">
                    <div aria-hidden="true" alt="icon-zone">
                        <img src="../../resource/images/obj_clique_logo.png" alt="spn-icon" />
                    </div>
                </footer>
            </section>
            :
            <div>
              {(this.state.isLoading) ? (<div>Loading...</div>) : (
                <div className="profile-popup">
                    <div>
                        <div>
                            <img src={this.state.picture} alt="profile-pic" />
                        </div>
                        <div className="profile-head" aria-hidden="true">
                            <h2 alt="profile-name">{this.state.firstName+" "+this.state.lastName}</h2>
                            <div><div alt="faculty-icon" className={`bg-${facultyMap.findInfoById(this.state.faculty).ClassNameKeyWord}`} /><p>{facultyMap.findInfoById(this.state.faculty).FullName}</p></div>
                        </div>
                    </div>

                    <div className="profile-section">
                        <h4>YOUR UPCOMING EVENT</h4>
                        <div className="my-event1">
                            {(this.state.join_events.length < 1) ? (<div></div>) : (
                                <div><div alt="event-icon"/> <p><strong>{this.state.event1_title} : </strong> {this.state.event1_date_start}</p></div>
                            )}
                        </div>
                        <div className="my-event2">
                            {(this.state.join_events.length < 2) ? (<div></div>) : (
                                <div><div alt="event-icon"/> <p><strong>{this.state.event2_title} : </strong> {this.state.event2_date_start}</p></div>
                            )}
                        </div>
                        <div className="my-event3">
                            {(this.state.join_events.length < 3) ? (<div></div>) : (
                                <div><div alt="event-icon"/> <p><strong>{this.state.event3_title} : </strong> {this.state.event3_date_start}</p></div>
                            )}
                        </div>
                    </div>

                    <div className="profile-section">
                        <h4>NOTIFICATION</h4>
                        <div className="my-noti profile-scroll">
                            {noti_list}
                        </div>
                    </div>
                </div>
              )}
                <p className="hr"></p>
                <div className="btn-profile">
                    <button alt="btn-myevent">MY EVENT</button>
                    <button alt="btn-logout" onClick={this.onLogout.bind(this)}>LOG OUT</button>
                </div>
            </div>
          }
        </div>
        );
    }
}

export default autoBind(profilePopup);
