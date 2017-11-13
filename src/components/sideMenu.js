/* eslint-disable */

import React , { Component } from 'react';
import $ from 'jquery';
import { Link } from 'react-router';
import { getCookie, clearAllCookie, getUserInfo } from '../actions/common';
import { fbLogin, fbLogout } from '../actions/index';
import './style/sideMenu.css';
import styled from 'styled-components';

const SideMenuStyle = styled.aside`
color: #222222;
position: fixed;
width: 300px;
height: 100%;
top: 0px;
left: -300px;
overflow-y: scroll;
-webkit-overflow-scrolling: touch;
overflow-x: hidden;
background-color: #FAFAFA;
box-sizing: border-box;

div[content="name"] {
    font-size: 1.3em;
    margin-bottom: 30px;
}

*[role="close"] {
    font-size: 1.5em;
    cursor: pointer;
    color: #AAA;
}
ul {
    padding: 0px;
}
li {
    list-style: none;
    padding: 10px;
    width: 100%;

    a {
        width: 100%;
        display: block;
        background-color: #CCC;
        padding: 10px 10px 10px 20px;

        ::before {
            content: "";
            width: 20px;
            height: calc(1em + 22px);
            position: absolute;
            left: 0px;
            transform: translateY(calc(-25%));
            background-color: #555;
        }

        &:active::before {
            background-color: #222;
        }

        &:active {
            background-color: #000;
        }
    }

    &:nth-child(2n) {'
        // background-color: #AAA;
        &::before {
            // background-color: #000;
        }
    }
}

section[content="profile"] {
    text-align: center;
    img {
        height: 100px;
        width: 100px;
        border-radius: 50%;
        border: 1px solid #000;
        margin-bottom: 10px;
    }
}
`;

const defaultState = {
  'name': "Guest",
  'picture': "../../resource/images/dummyProfile.png",
  'isLogin': false
};

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
                // console.log(error);
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
        fbLogout();
        if(this._isMounted) {
            this.setState(defaultState)
        }
        if(typeof(this.props.onLogin) === "function") this.props.onLogin(false);
        clearAllCookie();
    }

    render() {
        return (
            <SideMenuStyle className="side-menu content-move-inactive">
                <i className="fa fa-times" role="close" onClick={this.onClose}></i>
                <section content="profile">
                    <img src={this.state.picture} />
                    <div content="name">{this.state.name}</div>
                </section>
                { (this.state.isLogin) ? (
                      <ul>
                          <li><Link to="/profile">MY EVENT</Link></li>
                          <li><Link to="/calendar">CALENDAR</Link></li>
                          <li><Link to="/" onClick={this.onLogout.bind(this)}>LOG OUT</Link></li>
                      </ul>
                  ) : (
                      <ul>
                          <li><Link to="/signup" >Sign in / Sign up</Link></li>
                      </ul>
                  )
                }
            </SideMenuStyle>
        );
    }
}

export default sideMenu;
