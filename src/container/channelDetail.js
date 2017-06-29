import React, { Component } from 'react';
import autoBind from '../hoc/autoBind';
import EventItem from '../container/eventItem';
import './css/channelInfostyle.css';
import './css/channelDetail.css';
import './css/eventDetail2.css'
import axios from 'axios';
import { getCookie } from '../actions/common';
import * as facultyMap from '../actions/facultyMap';
import { hostname } from '../actions/index';
import ReactLoading from 'react-loading';


class channelInfo extends Component {
    constructor(props) {
        super(props);

        // title,about,video,channel,location,date_start,expire,date_end,picture,picture_large, year_require,faculty_require,tags,forms

        // about, video, location, date_start, date_end, picture, picture_large, year_require, faculty_require, tags, agreement, contact_information,
        // joinable_start_time, joinable_end_time, joinable_amount, time_start, time_end, optional_field, require_field, show, outsider_accessible

        let _this = this;

        this.state = {
            'channel_id': "5946205a4b908f001403aba5"
        }

        axios.get('http://128.199.208.0:1111/channel?id=' + _this.state.channel_id).then((data) => {
            console.log("get!!!");
            console.log(JSON.stringify(data.data.name))
            _this.state = {
                'name': data.data.name,
                'picture': data.data.picture,
                'detail': data.data.detail,
                'picture_large': data.data.picture_large,

                'new_name': data.data.name,
                'new_picture': data.data.picture,
                'new_detail': data.data.detail,
                'new_picture_large': data.data.picture_large,
            }
        }, (error) => {
            console.log("get channel error");
        });
    }
    
    onExit() {
        this.props.onToggle();
    }

    render () {
        return (
            <div>
                <article className="edit-event basic-card-no-glow modal-main">
                    <button className="card-exit invisible square-round" role="event-exit" onClick={this.onExit.bind(this)}>
                        <img src="../../resource/images/X.svg" />
                    </button>

                    <img src="../resource/images/dummyProfile.png" className="chan-img" alt="cn-profile-pic"/>
                    <h2 className="chan-name">channel name</h2>
                    <button className="bt-fol" alt="btn-follow">FOLLOW</button>

                    <p className="l1"></p>
                    
                    <div className="event-bio">
                    
                        <h3 className="display-none">Bio</h3>
                        <p>     Event Detail  Event Detail Event Detail Event Detail Event Detail
                        Event Detail  Event Detail Event Detail Event Detail Event Detail
                        Event Detail  Event Detail Event Detail Event Detail Event Detail
                        Event Detail  Event Detail Event Detail Event Detail Event Detail
                        Event Detail  Event Detail Event Detail Event Detail Event Detail
                        Event Detail  Event Detail Event Detail Event Detail Event Detail
                        Event Detail  Event Detail Event Detail Event Detail Event Detail
                        </p>
                    </div>
                <div className="marginleft">
                    <div className="chan-img-slide">
                        <a href="https://s-media-cache-ak0.pinimg.com/736x/a9/d5/ff/a9d5ffc839c6fd69bd76bdd1e81fb42d.jpg">
                            <img src="https://s-media-cache-ak0.pinimg.com/736x/a9/d5/ff/a9d5ffc839c6fd69bd76bdd1e81fb42d.jpg" />
                        </a>
                        <a href="https://s-media-cache-ak0.pinimg.com/736x/2c/06/90/2c0690f83727e1bf7d7d3f1eb60685bb.jpg">
                            <img src="https://s-media-cache-ak0.pinimg.com/736x/2c/06/90/2c0690f83727e1bf7d7d3f1eb60685bb.jpg" />
                        </a>
                        <a href="ttp://dl9fvu4r30qs1.cloudfront.net/47/3f/b9398ff842278569608c449da077/enemy-poster.jpg">
                            <img src="http://dl9fvu4r30qs1.cloudfront.net/47/3f/b9398ff842278569608c449da077/enemy-poster.jpg" />
                        </a>
                        <a href="https://s-media-cache-ak0.pinimg.com/736x/62/0c/aa/620caa23db6fa40d16f494ac17a47982.jpg">
                            <img src="https://s-media-cache-ak0.pinimg.com/736x/62/0c/aa/620caa23db6fa40d16f494ac17a47982.jpg" />
                        </a>
                        <a href="https://s-media-cache-ak0.pinimg.com/736x/d7/d6/ae/d7d6ae768606d96d23ee247827d79c73.jpg">
                            <img src="https://s-media-cache-ak0.pinimg.com/736x/d7/d6/ae/d7d6ae768606d96d23ee247827d79c73.jpg" />
                        </a>
                    </div>
                    <a href="#" className="box">
                        FACEBOOK
                        <div>www.facebook.com</div>
                    </a>
                    <a href="#" className="box">
                        YOUTUBE
                        <div>www.youtube.com</div>
                    </a>
                </ div>

                </article>
                <div className="background-overlay"/>
            </div>

        )
        
    }
}

export default autoBind(channelInfo);
