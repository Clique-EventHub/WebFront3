import React, { Component } from 'react';
import autoBind from '../hoc/autoBind';
import axios from 'axios';
import { getCookie, clearAllCookie, getEvent } from '../actions/common';
import * as facultyMap from '../actions/facultyMap';
// import { clearAllCookie } from '../actions/common';
import './css/profilePopup.css';
// import loginPage from '../pages/loginPage.js'
import { Link } from 'react-router';
import { hostname } from '../actions/index';
import ReactLoading from 'react-loading';
import _ from 'lodash';

const defaultState = {
  'firstName': '',
  'lastName': '',
  'picture': '',
  'faculty': '',
  'join_events': [],
  'notification': [],
  'upcoming_events': [],
  'n_noti': '',
  'isLoading': true,
  'login': false
};

function dateToFormat(date, option) {
	let nDate = new Date(date).toString();
    let refDate = new Date(date);
    if(option === 1) return nDate.slice(0, 3) + ", " + nDate.slice(8, 10) + " " + nDate.slice(4, 7) + " " + nDate.slice(11,15)
    if(option === 2) return refDate.getDate() + "/" + refDate.getMonth() + "/" + refDate.getFullYear()
    if(option === 3) return refDate.getDate() + "/" + refDate.getMonth() + "/" + String(refDate.getFullYear()).slice(2,4)
	return nDate.slice(8, 10) + " " + nDate.slice(4, 7) + " " + nDate.slice(11,15)
}

function compareDate(date1, date2) {
    const a = new Date(date1);
    const b = new Date(date2);

    if(a.getFullYear() === b.getFullYear()) {
        if(a.getMonth() === b.getMonth()) {
            if(a.getDate() === b.getDate()) return 0;
            else if(a.getDate() < b.getDate()) return -1;
            return 1;
        }
        else if(a.getMonth() < b.getMonth()) return -1;
        return 1;
    } else if(a.getFullYear() < b.getFullYear()) return -1;
    return 1;
}

class profilePopup extends Component {

    constructor(props) {
        super(props);
        this.state = defaultState;
    }

    componentWillReceiveProps(nextProps) {
        this.setState({updated: nextProps.updated});
    }

    componentWillMount() {
        if(getCookie('fb_sever_token') !== "") {
            this.setState({
                ...this.state,
                'login': true
            })
            let config = {
                'headers': {
                    'Authorization': ('JWT ' + getCookie('fb_sever_token'))
                }
            }

            let _this = this;

            axios.get(`${hostname}user`, config).then((data) => {
                _this.setState({
                    ..._this.state,
                    'firstName': data.data.firstName,
                    'lastName': data.data.lastName,
                    'picture': data.data.picture_200px,
                    'faculty': (data.data.regId === null)? '99': JSON.stringify(data.data.regId).substring(9, 11),
                    'join_events': data.data.join_events,
                    'notification': data.data.notification,
                    'n_noti': data.data.notification.length,
                    'isLoading': false
                }, () => {
                    this.state.join_events.forEach((id) => {
                        getEvent(id, false).then((data) => {
                            this.setState((prevState) => {
                                if(compareDate(new Date(data.date_start), new Date()) !== 1 && compareDate(new Date(data.date_end), new Date()) !== -1) {
                                    return {
                                        ...prevState,
                                        'upcoming_events': prevState.upcoming_events.concat([{
                                            'title': data.title,
                                            'date_start': data.date_start,
                                            'date_end': data.date_end,
                                        }])
                                    }
                                }
                                return {
                                    ...prevState
                                }
                            })
                        }, (error) => {
                            console.log("get event error", error);
                        });
                    })
                })
            }, (error) => {
                console.log(error);
            });
        }
    }

    onLogin() {
        this.props.fbLogin(this.props.fbGetSeverToken);

        setTimeout(() => {
            if(this.props.pages.FB !== null) {
                this.setState({
                    ...this.state,
                    'login': true
                });
                let config = {
                    'headers': {
                        'Authorization': ('JWT ' + getCookie('fb_sever_token'))
                    }
                }

                let _this = this;

                axios.get(`${hostname}user`, config).then((data) => {
                    _this.setState({
                        ..._this.state,
                        'firstName': data.data.firstName,
                        'lastName': data.data.lastName,
                        'picture': data.data.picture_200px,
                        'faculty': (data.data.regId === null)? '99': JSON.stringify(data.data.regId).substring(9, 11),
                        'join_events': data.data.join_events,
                        'notification': data.data.notification,
                        'n_noti': data.data.notification.length,
                        'isLoading': false
                    })
                }, (error) => {
                    console.log("get user error", error);
                });

                if(typeof(this.props.onLogin) === "function") this.props.onLogin(true);
            }
        }, 2000);
    }

    onLogout() {
        this.props.fbLogout();
        this.setState(defaultState)
        if(typeof(this.props.onLogin) === "function") this.props.onLogin(false);
        clearAllCookie();
    }

    onExit() {
        this.props.toggle_pop_item();
    }

    render() {
        var noti_list = [];
        var noti = this.state.notification;

        // console.log(this.state);

        for(var i = 0; i < this.state.n_noti ; i++){
            noti_list.push(<div className="noti"><img src={noti[i].photo} alt="noti-icon" /><p><strong>{noti[i].source} : </strong>{noti[i].title}</p></div>);
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
                </atricle>
                <footer alt="login-footer" style={{'borderRadius': '0px 0px 10px 10px'}}>
                    <div aria-hidden="true" alt="icon-zone">
                        <img src="../../resource/images/obj_clique_logo.png" alt="spn-icon" />
                    </div>
                </footer>
            </section>
            :
            <div>
              {(this.state.isLoading) ? (
                  <div className="flex flex-center">
                      <ReactLoading type={'bars'} color={'#878787'} height='40px' width='40px' />...Loading...<ReactLoading type={'bars'} color={'#878787'} height='40px' width='40px' />
                  </div>
              ) : (
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
                        {
                            _.get(this.state, 'upcoming_events', []).slice(0,3).map((item, index) => {
                                return (
                                    <div className="my-event" key={index}>
                                        <p><strong>{item.title} : </strong>
                                        {dateToFormat(item.date_start, 3)} to {dateToFormat(item.date_end, 3)}
                                        </p>
                                    </div>
                                );
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
                    <Link to="profile">
                        <button alt="btn-myevent">MY EVENT</button>
                    </Link>
                    <button alt="btn-logout" onClick={this.onLogout.bind(this)}>LOG OUT</button>
                </div>
            </div>
          }
        </div>
        );
    }
}

export default autoBind(profilePopup);
