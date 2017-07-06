import React, { Component } from 'react';
import autoBind from '../hoc/autoBind';
import EventItem from '../container/eventItem';
import './css/editEvent2.css';
import './css/channelInfostyle.css';
import axios from 'axios';
import { getCookie } from '../actions/common';

const TAG_1 = [
    "CAMP",
    "THEATHRE",
    "TALK",
    "FIRSTMEET",
    "RECRUITMENT",
    "MARKET",
    "VOLUNTEER",
    "CONCERT",
    "FESTIVAL",
    "OPENING",
    "CONTEST",
    "EXHIBITION",
    "WORKSHOP",
    "RELIGION"
];

const TAG_2 = [
    "CHARITY",
    "ACADEMIC",
    "BUSINESS",
    "CAREER",
    "SPORT",
    "ARTS",
    "FOOD&DRINK",
    "EDUCATION",
    "MUSIC",
    "TECHNOLOGY",
    "NATURAL",
    "HEALTH"
]

class Btn extends Component {
    //BtnToggleState
    constructor(props) {
        super(props);
        this.state = {
            'isActive': false
        }
        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        let tmp = !this.state.isActive;
        this.setState({
            ...this.state,
            'isActive': tmp
        });
        if(typeof(this.props.callback) === "function") this.props.callback(tmp);
    }

    render() {
        return (
            <button onClick={this.onClick} className={(this.state.isActive) ? this.props.classNameOn : this.props.classNameOff}>
                {this.props.text}
            </button>
        );
    }
}

class channelInfo extends Component {
    constructor(props) {
        super(props);

        // title,about,video,channel,location,date_start,expire,date_end,picture,picture_large, year_require,faculty_require,tags,forms

        // about, video, location, date_start, date_end, picture, picture_large, year_require, faculty_require, tags, agreement, contact_information,
        // joinable_start_time, joinable_end_time, joinable_amount, time_start, time_end, optional_field, require_field, show, outsider_accessible

        let _this = this;

        this.state = {
            'channel_id': "5953e2f4dd3c09001422e9ed"
        }

           axios.get('http://128.199.208.0:1111/channel?id=' + _this.state.channel_id).then((data) => {
            console.log("get!!!");
            console.log(JSON.stringify(data.data.name))
            console.log(JSON.stringify(data.data.picture))
            console.log(JSON.stringify(data.data.picture_large))
            console.log(JSON.stringify(data.data.picture_large))

            _this.state = {
                'name': data.data.name,
                'picture': data.data.picture,
                'detail': data.data.detail,
                'picture_large': data.data.picture_large,
                'tags': data.data.tags,

                'new_name': data.data.name,
                'new_picture': data.data.picture,
                'new_detail': data.data.detail,
                'new_picture_large': data.data.picture_large,
                'new_tags': data.data.tags,
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
            'new_tags': this.refs.tags.value,
        };
        this.setState(newState);
    }

    save() {
        console.log("kuyyyyy");
        const newState = {
            ...this.state,
            'name': this.state.name.value,
            'picture': this.state.picture.value,
            'detail': this.state.detail.value,
            'picture_large': this.state.picture_large.value,
            'tags': this.state.tags.value,
        };
        this.setState(newState);

        let config = {
            'headers': {
                'Authorization': ('JWT ' + getCookie('fb_sever_token'))
            }
        }

        let responseBody = {
            'name': this.state.name.value,
            'picture': this.state.picture.value,
            'detail': this.state.detail.value,
            'picture_large': this.state.picture_large.value,
            'tags': this.state.tags.value,
        }

        let _this = this;

        axios.put('http://128.199.208.0:1111/event?id='+ _this.state.event_id, responseBody, config).then((response) => {
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
            'new_tags': this.state.tags,
        };
        this.setState(newState);
        this.props.toggle_pop_item();
    }

    onSelectedPicture() {

    }
     

    onSelectedPoster() {
        const input = this.refs["picture_large"];
        const div = this.refs["preview-image"];
        const _this = this;
 
        if (input.files && input.files[0]) {
            let reader = new FileReader();

            reader.onload = function (e) {
                div.style.backgroundImage = `url('${e.target.result}')`;

                _this.setState({
                    ..._this.state,
                    'new': {
                        ..._this.state.new,
                        'picture_large': e.target.result
                    }
                })
            }

            reader.readAsDataURL(input.files[0]);
        }


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

            
                    <label className="changeprofile">
                        <img src={this.state.new_picture} className="chan-img" alt="cn-profile-pic"/>
                        <input type="file" ref="picture" onChange={this.onSelectedPicture} name="picture" className="fileInput" accept="image/*" />
                     </label>


                    <input className="chan-name" ref="name" type="text" placeholder="" value={this.state.new_name} onChange={this.onKeyPressed} />

                    <p className="l1"></p>
                     
                    <div className="full-input">
                        <h1>DETAIL</h1> 
                        <textarea className="detail" ref="about" type="text" placeholder="" value={this.state.new_detail} onChange={this.onKeyPressed}/>
                        
                        <div>
                            <h1>PHOTO</h1> 

                            <label className="fileContainer">
                                <div>UPLOAD</div>
                                <input type="file" ref="poster" onChange={this.onSelectedPoster} id="poster" name="poster" className="fileInput" accept="image/*" />
                            </label>

                            <div className="photo-upload">
                                pic1.png
                                <button role="event-exit" onClick={this.onDelect.bind(this)}>
                                    <img src="../../resource/images/X.svg" />
                                </button>
                            </div>

                            <div data-alt="preview-image" ref="preview-image" />
                        </div>

                        <h1>URL</h1> <input ref="url" type="text" placeholder="" />
                        <h1>YOUTUBE</h1> <input ref="youtube" type="text" placeholder=""/>
                    </div>
                    
                    <div className="chan-tag">
                        <h1>TAG</h1>                    
                        {
                            TAG_1.map((key, index) => {
                                return (<Btn key={index} text={`${key}`} classNameOn="Btn-active tag" classNameOff="Btn tag"/>);
                            })
                        }
                        <br />
                        <br />
                        {
                            TAG_2.map((key, index) => {
                                return (<Btn key={index} text={`${key}`} classNameOn="Btn-active tag" classNameOff="Btn tag"/>);
                            })
                        }
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
