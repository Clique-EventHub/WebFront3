/* eslint-disable */

import React , { Component } from 'react';
import $ from 'jquery';
import { Link } from 'react-router';

class sideMenu extends Component {

    // constructor(props) {
    //     super(props);
    // }

    //How to Link, <Link to="ชื่อ path ตรงนี้">{Text}</Link>
    //พอใช้ Link จะถูก render เป็น <a> แต่ถ้าใช้ <a> โดยตรง app จะพัง
    //css ใช้ a tag selector ได้ แค่นี้แหละที่จะบอก ไปแต่งมาหน่อย

    onClose() {
        $(".content-move-active").removeClass("content-move-active").addClass("content-move-inactive");
    }

    render() {
        return (
            <aside className="side-menu content-move-inactive">
                <i className="fa fa-times" role="close" onClick={this.onClose}></i>
                <section content="profile">
                    <img src="../../resource/images/dummyProfile.png" />
                    <div content="name">MyName isDummy</div>
                </section>
                <ul>
                    <li>My Profile</li>
                    <li>Calendar</li>
                    <li>Log Out</li>
                </ul>
            </aside>
        );
    }
}

export default sideMenu;
