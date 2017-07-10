import React, { Component } from 'react';
import autoBind from '../hoc/autoBind';
import EventItem from '../container/eventItem';
import './css/editEvent2.css';
import './css/channelInfostyle.css';
import axios from 'axios';
import { getCookie } from '../actions/common';

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

        axios.get('http://139.59.97.65:1111/channel?id=' + _this.state.channel_id).then((data) => {
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

        this.onKeyPressed = this.onKeyPressed.bind(this);
    }

    onKeyPressed() {
        const newState = {
            ...this.state,
            'new_name': this.refs.name.value,
            'new_picture': this.refs.picture.value,
            'new_detail': this.refs.detail.value,
            'new_picture_large': this.refs.picture_large.value,
        };
        this.setState(newState);
    }

    save() {
        const newState = {
            ...this.state,
            'name': this.refs.name.value,
            'picture': this.refs.picture.value,
            'detail': this.refs.detail.value,
            'picture_large': this.refs.picture_large.value,
        };
        this.setState(newState);

        let config = {
            'headers': {
                'Authorization': ('JWT ' + getCookie('fb_sever_token'))
            }
        }

        let responseBody = {
            'name': this.refs.name.value,
            'picture': this.refs.picture.value,
            'detail': this.refs.detail.value,
            'picture_large': this.refs.picture_large.value,
        }

        let _this = this;

        axios.put('http://139.59.97.65:1111/event?id='+ _this.state.event_id, responseBody, config).then((response) => {
            console.log("saved!!!");
            return true;
        }, (error) => {
            console.log("save error");
            return false;
        })

        this.props.toggle_pop_item();
    }

    cancel() {
        const newState = {
            ...this.state,
            'new_name': this.state.name,
            'new_picture': this.state.picture,
            'new_detail': this.state.detail,
            'new_picture_large': this.state.picture_large,
        };
        this.setState(newState);
        this.props.toggle_pop_item();
    }

    onExit() {
        this.props.onToggle();
    }

    onDelect() {
        this.props.invisible();
    }


    render () {
        return (
            <div>
                <article className="edit-event basic-card-no-glow modal-main">
                    <button className="card-exit invisible square-round" role="event-exit" onClick={this.onExit.bind(this)}>
                        <img src="../../resource/images/X.svg" />
                    </button>

                    <img src="../resource/images/dummyProfile.png" className="chan-img" alt="cn-profile-pic"/>
                    <input className="chan-name" ref="name" type="text" placeholder="" value={this.state.new_name} onChange={this.onKeyPressed} />

                    <p className="l1"></p>

                    <div className="full-input">
                        <h1>DETAIL</h1>
                        <textarea className="detail" ref="about" type="text" placeholder="" value={this.state.new_detail} onChange={this.onKeyPressed}/>

                        <div>
                            <h1>PHOTO</h1> <button className="fill">UPLOAD</button>

                            <div className="photo-upload">
                                pic1.png
                                <button role="event-exit" onClick={this.onDelect.bind(this)}>
                                    <img src="../../resource/images/X.svg" />
                                </button>
                            </div>

                            <div className="photo-upload">
                                pic1.png
                                <button role="event-exit" onClick={this.onDelect.bind(this)}>
                                    <img src="../../resource/images/X.svg" />
                                </button>
                            </div>

                            <div className="photo-upload">
                                pic1.png
                                <button role="event-exit" onClick={this.onDelect.bind(this)}>
                                    <img src="../../resource/images/X.svg" />
                                </button>
                            </div>
                        </div>

                        <h1>URL</h1> <input ref="url" type="text" placeholder="" />
                        <h1>YOUTUBE</h1> <input ref="youtube" type="text" placeholder=""/>
                    </div>



                    <div className="chan-tag">
                        <h1>TAG</h1>
                        <button className="tag">CAMP</button>
                        <button className="tag">THEATRE</button>
                        <button className="tag">TALK</button>
                        <button className="tag">FIRSTMEET</button>
                        <button className="tag">STAFF RECRUITMENT</button>
                        <button className="tag">MARKET</button>
                        <button className="tag">VOLUNTEER</button>
                        <button className="tag">CONCERT</button>
                        <button className="tag">FESTIVAL</button>
                        <button className="tag">OPENING</button>
                        <button className="tag">CONTEST</button>
                        <button className="tag">EXHIBITION</button>
                        <button className="tag">WORKSHOP</button>
                        <button className="tag">RELIGION</button>
                        <br />
                        <br />
                        <button className="tag">CHARILY</button>
                        <button className="tag">ACADEMIC</button>
                        <button className="tag">BUSSINESS</button>
                        <button className="tag">CAREER</button>
                        <button className="tag">SPORT</button>
                        <button className="tag">ARTS</button>
                        <button className="tag">FOOD&DRINK</button>
                        <button className="tag">EDUCATION</button>
                        <button className="tag">MUSIC</button>
                        <button className="tag">TECHNOLOGY</button>
                        <button className="tag">NATURAL</button>
                        <button className="tag">HEALTH</button>
                    </div>

                    <br />
                    <br />
                    <br />
                    <div>
                        <button className="bt blue" onClick={this.save.bind(this)}>SAVE</button>
                        <button className="bt" onClick={this.cancel.bind(this)}>CANCLE</button>
                    </div>
                </article>
                <div className="background-overlay"/>
            </div>
        )
    }
}

export default autoBind(channelInfo);
