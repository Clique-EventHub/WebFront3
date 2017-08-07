import React, { Component } from 'react';
import './css/channelDetail.css';
import axios from 'axios';
import { hostname } from '../actions/index';
import { getCookie } from '../actions/common';
import Image from '../components/Image';
import Btn from '../components/Btn';
import PictureUpload from '../components/PictureUpload';
import _ from 'lodash';

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
    "RELIGION",
    "",
    "",
    "",
    "",
    ""
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
    "HEALTH",
    "",
    "",
    "",
    "",
    ""
]

function onTextareaResize(textArea) {
    textArea.style.height = 'auto';
    textArea.style.height = textArea.scrollHeight+'px';
}

const Input = (props) => {
    return (
        <div className="mar-v-10 InputContainer">
            {
                (props.isTextarea) ? (
                    <textarea
                        className="flex-order-2 bottom-outline-1 border-focus-blue border-transition"
                        placeholder={props.placeholder}
                        ref={(textarea) => {
                                if(typeof props.refI === "function") props.refI(textarea);
                            }
                        }
                        onChange={(e) => onTextareaResize(e.target)}
                    />
                ) : (
                    <input
                        type="text"
                        className="flex-order-2 bottom-outline-1 border-focus-blue border-transition"
                        placeholder={props.placeholder}
                        ref={(input) => {
                            if(typeof props.refI === "function") {
                                props.refI(input);
                            }
                        }}
                    />
                )
            }
            {
                (_.get(props, 'text', '').length > 0) ? (
                    <label className="flex-order-1">{props.text}</label>
                ) : null
            }
            {(_.get(props, 'note', '').length > 0) ? (
                <span className="flex-order-3 note">{props.note}</span>
            ) : null}
        </div>
    )
}

class channelInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            'channel_id': "595e86832ff0cf001402ab99"
        }

        axios.get(`${hostname}channel?id=${this.state.channel_id}`).then((data) => {
            this.channelName.value = data.data.name;
            // this.setState({
            //     ...this.state,
            //     'name': data.data.name,
            //     'picture': data.data.picture,
            //     'detail': data.data.detail,
            //     'picture_large': data.data.picture_large,
            //     'tags': data.data.tags,
            //
            //     'new_name': data.data.name,
            //     'new_picture': data.data.picture,
            //     'new_detail': data.data.detail,
            //     'new_picture_large': data.data.picture_large,
            //     'new_tags': data.data.tags,
            // });
        }, (error) => {
            console.log("get channel error");
            this.channelName.value = 'LOAD ERROR';
        });

        this.save = this.save.bind(this);
    }

    save() {
        this.setState({
            ...this.state,
            'name': this.state.new_name,
            'picture': this.state.new_picture,
            'detail': this.refs.about.value,
            'picture_large': this.state.new_picture_large,
            'tags': this.state.new_tags
        });

        console.log(this.refs.about.value);
        console.log(this.state.detail);

        let config = {
            'headers': {
                'Authorization': ('JWT ' + getCookie('fb_sever_token')),
                'crossDomain': true,
            }
        }
        let responseBody = {
            'name': this.refs.about.name,
            //'picture': this.state.picture.value,
            //'detail': [this.refs.about.value],
            //'picture_large': this.state.picture_large.value,
            //'tags': this.state.tags
        };
        console.log("dddd");
        console.log(responseBody.detail);
        console.log(this.state.channel_id);
        axios.put(`${hostname}channel?id=${this.state.channel_id}`, responseBody, config).then((response) => {
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

    onExit() {
        this.props.onToggle();
    }

    render () {
        return (
            <div className="modal-container">
                <article className="edit-event basic-card-no-glow modal-main card-width channel-detail">
                    <button className="card-exit invisible square-round" role="event-exit" onClick={this.onExit.bind(this)}>
                        <img src="../../resource/images/X.svg" />
                    </button>
                    <div className="flex flex-aligns-item">
                        <Image src={this.state.new_picture} imgClass="chan-img" rejectClass="chan-img" />
                        <div>
                            <Input refI={(input) => this.channelName = input} text="CHANNEL NAME" placeholder="CHANNEL NAME" />
                        </div>
                    </div>
                    <hr className="thin" />
                    <PictureUpload
                        text="UPLOAD PROFILE IMAGE"
                        isInit={true}
                        srcs={['']}
                        showFilesNumber={false}
                        persistentImg={false}
                        onUpdate={(val, t) => {

                        }}
                        style={{'width': '100%'}}
                    />
                    <Input refI={(textarea) => this.detail = textarea} text="CHANNEL DETAIL" placeholder="CHANNEL DETAIL" isTextarea={true} />
                    <Input refI={(input) => this.channelLink = input} text="URL" placeholder="URL" />
                    <Input refI={(input) => this.channelVideo = input} text="YOUTUBE EMBED" placeholder="YOUTUBE EMBED" />
                    <PictureUpload
                        text="UPLOAD PICTURES"
                        isMultiple={true}
                        isInit={true}
                        srcs={['']}
                        showFilesNumber={true}
                        persistentImg={true}
                        onUpdate={(val, t) => {

                        }}
                        style={{'width': '100%'}}
                    />
                    <div className="chan-tag">
                        <h1>TAG</h1>
                        <div className="tag-container">
                            {
                                TAG_1.map((key, index) => {
                                    return (
                                        <Btn
                                            key={index}
                                            text={`${key}`}
                                            isInit={true}
                                            initialState={false}
                                            classNameOn={`Btn tag Btn-active tag${(key.length === 0) ? ' empty' : ''}${(key.length > 7) ? ' long' : ''} `}
                                            classNameOff={`Btn tag ${(key.length === 0) ? ' empty' : ''}${(key.length > 7) ? ' long' : ''}`}
                                            callback={(isActive) => {}}
                                        />
                                    );
                                })
                            }
                        </div>
                        <div className="tag-container mar-v-10">
                            {
                                TAG_2.map((key, index) => {
                                    return (
                                        <Btn
                                            key={index}
                                            text={`${key}`}
                                            isInit={true}
                                            initialState={false}
                                            classNameOn={`Btn tag Btn-active tag${(key.length === 0) ? ' empty' : ''}${(key.length > 7) ? ' long' : ''} `}
                                            classNameOff={`Btn tag ${(key.length === 0) ? ' empty' : ''}${(key.length > 7) ? ' long' : ''}`}
                                            callback={(isActive) => {}}
                                        />
                                    );
                                })
                            }
                        </div>
                    </div>
                    <footer>
                        <button className="bt">CANCEL</button>
                        <button className="bt blue">SAVE</button>
                    </footer>
                </article>
                <div className="background-overlay"/>
            </div>
        )
    }
}

export default channelInfo;
