import React, { Component } from 'react';
import axios from 'axios';
import { getCookie } from '../actions/common';
import { hostname } from '../actions/index';

class profilePopup extends Component {

    constructor(props) {
        super(props);

        this.state = {
            user: {
                data: null,
                isLoading: true
            },
            ownUser: {
                data: null,
                events: [],
                isLoading: true
            },
        };

    }

    componentWillReceiveProps(nextProps) {
        if(this.state.user !== nextProps.user && nextProps.user.events !== null && nextProps.user.info !== null && nextProps.user.meta !== null) {
            this.setState({
                ...this.state,
                'user': {
                    'data': nextProps.user,
                    'isLoading': false
                }
            });
        }
    }

    componentWillMount() {

        let config = {
            'headers': {
                'Authorization': ('JWT ' + getCookie('fb_sever_token')),
                'crossDomain': true
            }
        }

        axios.get(`${hostname}user`, config).then((data) => {
            this.setState({
                ...this.state,
                'ownUser': {
                    ...this.state.ownUser,
                    'data': {
                        'firstName': data.data.firstName,
                        'lastName': data.data.lastName,
                        'picture': data.data.picture_200px,
                        'faculty': (data.data.faculty == null)? 'Faculty of Engineering': data.data.faculty,
                        'join_events': data.data.join_events,
                        'notification': data.data.notification,
                        'n_noti': data.data.notification.length
                    },
                    'isLoading': false
                }

            })

            data.data.join_events.forEach((id) => {
                axios.get(`${hostname}event?id=${id}&stat=false`, { headers: { 'crossDomain': true }}).then((data) => {
                    if(new Date(data.data.date_start) >= new Date()) {
                        this.setState({
                            ...this.state,
                            'ownUser': {
                                ...this.state.ownUser,
                                'events': this.state.ownUser.events.concat([{
                                    'title': data.data.title,
                                    'date_start': new Date(data.data.date_start).toString().slice(0,15)
                                }])
                            }
                        })
                    }
                }, (error) => {
                    console.log("get event error");
                });
            })
        }, (error) => {
            console.log("get user error");
        });

    }

    render() {
        var noti_list = [];
        var noti = this.state.notification;

        for(var i = 0; i < this.state.n_noti ; i++){
            noti_list.push(<div><img src={noti[i].photo} alt="noti-icon" /><p><strong>{noti[i].source} : </strong>{noti[i].title}</p></div>);
        }

        return (
            <div>
              {(this.state.ownUser.isLoading) ? (<div>Loading...</div>) : (
                <div className="profile-popup">
                    <div>
                        <div>
                            <img src={this.state.ownUser.data.picture} alt="profile-pic" />
                        </div>
                        <div className="profile-head" aria-hidden="true">
                            <h2 alt="profile-name">{this.state.ownUser.data.firstName+" "+this.state.ownUser.data.lastName}</h2>
                            <div><div alt="faculty-icon" /> <p>{this.state.ownUser.data.faculty}</p></div>
                        </div>
                    </div>
                    <div className="profile-section">
                        <h4>YOUR UPCOMING EVENT</h4>
                        {
                            this.state.ownUser.events.map((item, index) => {
                                if(index < 3) {
                                    return (
                                        <div className={`my-event${index+1}`} key={index}>
                                            <div><div alt="event-icon"/> <p><strong>{item.title} : </strong> {item.date_start}</p></div>
                                        </div>
                                    );
                                }
                                return null;
                            })
                        }
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
                    <button alt="btn-logout">LOG OUT</button>
                </div>
            </div>
        );
    }
}

export default profilePopup;
