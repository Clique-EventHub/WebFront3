/* eslint-disable */

import React , { Component } from 'react';
import $ from 'jquery';
import { Link } from 'react-router';
import { getCookie, clearAllCookie, getUserInfo } from '../actions/common';
import './style/sideMenu.css';

class sideMenu extends Component {

    // constructor(props) {
    //     super(props);
    // }

    //How to Link, <Link to="ชื่อ path ตรงนี้">{Text}</Link>
    //พอใช้ Link จะถูก render เป็น <a> แต่ถ้าใช้ <a> โดยตรง app จะพัง
    //css ใช้ a tag selector ได้ แค่นี้แหละที่จะบอก ไปแต่งมาหน่อย

    constructor(props) {
        super(props);
        this.state = {
            'name': "Guest",
            'picture': "../../resource/images/dummyProfile.png",
            'isLogin': false
        }

    }

    componentDidMount() {
        this._isMounted = true;

        if(getCookie('fb_sever_token') !== "") {
            if(this._isMounted) {
                this.setState({
                    ...this.state,
                    'isLogin': true
                })
            }

            let _this = this;

            getUserInfo().then((data) => {
                if(this._isMounted) {
                    _this.setState({
                        ..._this.state,
                        'name': data.firstName,
                        'picture': data.picture_200px,
                    })
                }
            }, (error) => {
                console.log(error);
            });
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentWillReceiveProps(nextProps) {
        if(this._isMounted) {
            this.setState({updated: nextProps.updated});
        }
    }

    onClose() {
        $(".content-move-active").removeClass("content-move-active").addClass("content-move-inactive");
    }

    onLogout() {
        this.props.fbLogout();
        if(this._isMounted) {
            this.setState(defaultState)
        }
        if(typeof(this.props.onLogin) === "function") this.props.onLogin(false);
        clearAllCookie();
    }

    render() {
        return (
            <aside className="side-menu content-move-inactive">
                <i className="fa fa-times" role="close" onClick={this.onClose}></i>
                <section content="profile">
                    <img src={this.state.picture} />
                    <div content="name">{this.state.name}</div>
                </section>
                <ul>
                    <li><Link to="/profile">MY EVENT</Link></li>
                    <li><Link to="/calendar">CALENDAR</Link></li>
                    <li><Link to="/"><button className="invisible" onClick={this.onLogout.bind(this)}>LOG OUT</button></Link></li>
                </ul>
            </aside>
        );
    }
}

export default sideMenu;
