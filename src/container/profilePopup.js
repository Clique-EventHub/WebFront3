/* eslint-disable */

import React, { Component } from 'react';
import autoBind from '../hoc/autoBind';

class profilePopup extends Component {
    // constructor(props) {
    //     super(props);
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
