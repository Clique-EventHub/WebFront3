/* eslint-disable */

import React , { Component } from 'react';
import $ from 'jquery';

class sideMenu extends Component {

    // constructor(props) {
    //     super(props);
    // }

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
                    <li>Test</li>
                    <li>Test 2</li>
                    <li>Test</li>
                    <li>Test 2</li>
                    <li>Test</li>
                    <li>Test 2</li>
                    <li>Test</li>
                    <li>Test 2</li>
                </ul>
            </aside>
        );
    }
}

export default sideMenu;
