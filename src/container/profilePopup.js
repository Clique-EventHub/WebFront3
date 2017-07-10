/* eslint-disable */

import React, { Component } from 'react';
import autoBind from '../hoc/autoBind';

class profilePopup extends Component {
<<<<<<< HEAD

    constructor(props) {
        super(props);

        this.state = {
          'firstName': '',
          'lastName': '',
          'picture': '',
          'faculty': '',
          'join_events': '',
          'notification': '',
          'n_noti': '',
          'event1_title': '',
          'event1_date_start': '',
          'event2_title': '',
          'event2_date_start': '',
          'event3_title': '',
          'event3_date_start': '',
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

        axios.get('http://139.59.97.65:1111/user', config).then((data) => {
            console.log("get!!!");
            console.log(JSON.stringify(data.data.firstName));
            _this.setState({
                ...this.state,
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
        //         axios.get('http://139.59.97.65:1111/event?id=' + this.state.join_events[i]).then((data) => {
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
            axios.get('http://139.59.97.65:1111/event?id=' + this.state.join_events[i]).then((data) => {
                console.log("get!!!");
                console.log(JSON.stringify(data.data.title))
                if(i === 0){
                    _this.setState({
                        ...this.state,
                        'event1_title': data.data.title,
                        'event1_date_start': data.data.date_start,
                    })
                } else if (i === 1) {
                    _this.setState({
                        ...this.state,
                        'event2_title': data.data.title,
                        'event2_date_start': data.data.date_start,
                    })
                } else if (i === 2) {
                    _this.setState({
                        ...this.state,
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
        this.setState({
            ...this.state,
            'login': true
        });
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

        axios.get('http://139.59.97.65:1111/user', config).then((data) => {
            console.log("get!!!");
            console.log(JSON.stringify(data.data.firstName));
            _this.setState({
                ...this.state,
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
        this.setState({
            ...this.state,
            'login': false
        })
    }

    // logout() {
    //     clearAllCookie();
    //     this.setState({'login': false})
=======
    // constructor(props) {
    //     super(props);
>>>>>>> 9c49bcfa2dbad34a172369ac808e9c80cf9b6836
    // }

    onExit() {
        this.props.toggle_pop_item();
    }

    render() {
        return (
            <div>
                <div className="profile-popup">
                    <div>
                        <div>
                            <img src="../resource/images/dummyProfile.png" alt="profile-pic" />
                        </div>
                        <div className="profile-head" aria-hidden="true">
                            <h2 alt="profile-name">Mitsuha Atchula</h2>
                            <div><div alt="faculty-icon" /> <p>Faculty of Engineering</p></div>
                        </div>
                    </div>

                    <div className="profile-section">
                        <h4>YOUR UPCOMING EVENT</h4>
                        <div className="my-event1">
                            <div alt="event-icon" /> <p><strong>Event Name</strong> Tomorrow </p>
                        </div>
                        <div className="my-event2">
                            <div alt="event-icon" /> <p><strong>Event Name</strong> 1 Feb 2016 </p>
                        </div>
                        <div className="my-event3">
                            <div alt="event-icon" /> <p><strong>Event Name</strong> 5 May 2017 </p>
                        </div>
                    </div>

                    <div className="profile-section">
                        <h4>NOTIFICATION</h4>
                        <div className="my-noti">
                            <img src="../resource/images/dummyProfile.png" alt="noti-icon" />
                            <p><strong>Taki</strong> invite you to join <strong>"Event Name"</strong></p>
                        </div>
                    </div>
                </div>
                <p className="hr"></p>
                <div className="btn-profile">
                    <button alt="btn-myevent">MY EVENT</button>
                    <button alt="btn-logout">LOG OUT</button>
                </div>
            </div>
        );
    }
}

export default autoBind(profilePopup);
