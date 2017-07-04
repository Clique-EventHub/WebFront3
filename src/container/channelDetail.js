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


        this.state = {
            'name': "",
            'picture': "",
            'detail': "",
            'picture_large': []
        }
        axios.get('http://128.199.208.0:1111/channel?id=' + "5953e2f4dd3c09001422e9ed").then((data) => {
            console.log("get!!!dd");
            console.log(JSON.stringify(data.data.name))
            this.setState({
                'name': data.data.name,
                'picture': data.data.picture,
                'detail': data.data.detail,
                'picture_large': data.data.picture_large
            });
        }, (error) => {
            console.log("get channel error");
        });
    }

    onExit() {
        this.props.onToggle();
    }

    render () {
console.log(this.state.picture);
        return (
            <div>
                <article className="edit-event basic-card-no-glow modal-main">
                    <button className="card-exit invisible square-round" role="event-exit" onClick={this.onExit.bind(this)}>
                        <img src="../../resource/images/X.svg" />
                    </button>

                    <img src={this.state.picture} className="chan-img" alt="cn-profile-pic"/>
                    <h2 className="chan-name">{this.state.name}</h2>
                    <button className="bt-fol" alt="btn-follow">FOLLOW</button>

                    <p className="l1"></p>

                    <div className="event-bio">

                        <h3 className="display-none">Bio</h3>
                        <p>     {this.state.detail}
                        </p>
                    </div>
                <div className="marginleft">
                    <div className="chan-img-slide">
                        {() => {
                            if(this.state.picture_large.length > 0) {
                                this.state.picture_large.map((url) => {
                                    return <a href={url}><img src={url} /></a>
                                })
                            }
                        }}
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
