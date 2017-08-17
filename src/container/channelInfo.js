import React, { Component } from 'react';
import './css/channelDetail.css';
import axios from 'axios';
import { hostname } from '../actions/index';
import { getCookie, getChannel, getTags } from '../actions/common';
import Image from '../components/Image';
import Btn from '../components/Btn';
import PictureUpload from '../components/PictureUpload';
import _ from 'lodash';
import ReactLoading from 'react-loading';

const enableTag = false;

const defaultText = 'NO INFO';

function onTextareaResize(textArea) {
    textArea.style.height = 'auto';
    textArea.style.height = textArea.scrollHeight+'px';
}

function checkPicturesUrl(url) {
    if(typeof url === "string") return (url.indexOf("https://api.cueventhub.com/picture/") === 0)
    return false;
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

        let tagState = {};

        this.state = {
            'channel_id': "595ef6b8822dbf0014cb821b",
            'poster': [],
            'poster_file': [],
            'picture': [],
            'picture_file': [],
            'isLoad': false,
            'tagsState': tagState,
            'refObj': null,
            'TAG_1': [],
            'TAG_2': []
        }

        getTags().then((tags) => {
            this.setState((prevState) => {
                let all_tags = [];
                Object.keys(tags).forEach((key) => {
                    all_tags = all_tags.concat(tags[key])
                })
                let tagState = this.state.tagState || {};
                all_tags.filter((item) => item.length > 0).forEach((item) => tagState[item] = false);

                return ({
                    ...prevState,
                    TAG_1: tags.Platform,
                    TAG_2: tags.Content,
                    tagState: tagState
                });
            })
        })

        getChannel(this.state.channel_id, false).then((data) => {
            this.setState((prevState, props) => {
                return {
                    ...prevState,
                    poster: [_.get(data, 'picture', '')],
                    picture: _.get(data, 'picture_large', []),
                    refObj: data,
                    isLoad: true
                }
            }, () => {
                this.channelName.value = data.name;
                this.channelVideo.value = _.get(data, 'video', defaultText);
                this.channelLink.value = _.get(data, 'url', defaultText);
                this.detail.value = _.get(data, 'detail', [defaultText]).join("\n\n");

                onTextareaResize(this.detail);
            })
        }, (error) => {
            this.setState((prevState) => {
                return {
                    ...prevState,
                    isLoad: true
                }
            }, () => {
                this.channelName.value = defaultText;
                this.detail.value = defaultText;
                this.channelVideo.value = defaultText;
                this.channelLink.value = defaultText;
            })
        });

        this.onSave = this.onSave.bind(this);
    }

    onSave() {
        const config = {
            'headers': {
                'Authorization': ('JWT ' + getCookie('fb_sever_token')),
                'crossDomain': true,
            }
        }

        let responseBody = {
            'name': this.channelName.value,
            'detail': this.detail.value.split("\n\n"),
            'video': this.channelVideo.value,
            'url': this.channelLink.value,
        };
        if(enableTag) {
            responseBody["tags"] = Object.keys(this.state.tagsState).filter((tagName) => this.state.tagsState[tagName])
        }

        //Poster Process
        const posterPromises = [];
        const oldPoster = _.get(this.state.refObj, 'picture', "");
        let newPoster = _.get(this.state, 'poster', [""])
        if(newPoster.constructor === Array && newPoster.length > 0) newPoster = newPoster[0];

        if(oldPoster !== newPoster) {
            posterPromises.push(axios.delete(`${hostname}picture`, {
                ...config,
                'data': {
                    'urls': [oldPoster]
                }
            }));
            const poster_file = _.get(this.state,'poster_file', []);
            if(poster_file.length > 0) {
                const formData = new FormData();
                formData.append('pictures', poster_file[0]);
                posterPromises.push(
                    axios.post(`${hostname}picture?id=${this.state.channel_id}&size=small&field=channel`, formData, config)
                );
            }
            Promise.all(posterPromises).then((datas) => {
                // console.log(datas);
            }).catch((e) => {
                // console.log(e);
            })
        }

        //Picture Process
        let pictures = [];
        const picturePromises = [];
        if(!_.get(this.state.refObj, 'picture_large', []).equals(_.get(this.state, 'picture'))) {
            //Do something
            const oldPicture = this.state.refObj.picture_large;
            const newPicture = _.get(this.state, 'picture', []);
            const diffA = oldPicture.filter(function(x) { return newPicture.indexOf(x) < 0 }); //oldPicture - newPicture
            // const diffB = newPicture.filter(function(x) { return oldPicture.indexOf(x) < 0 }) //newPicture - oldPicture

            if(diffA.length > 0) {
                //TODO: DELETING OLD PICTURES
                const configs = {
                    ...config,
                    'data': {
                        'urls': diffA.filter((item) => checkPicturesUrl(item))
                    }
                }

                picturePromises.push(
                    new Promise((good, bad) => {
                        axios.delete(`${hostname}picture`, configs).then((data) => {
                            // console.log(data);
                            return good(true);
                        }).catch((error) => {
                            // console.log(error);
                            return bad(error);
                        })
                    })
                )
            } else {
                // console.log("No data to delete");
            }

            const picture_file = _.get(this.state, 'picture_file', []);

            if(picture_file.length > 0) {
                const formData = new FormData();
                picture_file.forEach((file) => {
                    formData.append('pictures', file);
                })
                picturePromises.push(new Promise((good, bad) => {
                    axios.post(`${hostname}picture?id=${this.state.channel_id}&size=large&field=channel`, formData, config).then(
                        (data) => {
                            return good(true);
                        }).catch((e) => {
                            bad(e)
                        })
                }))
            }
        }

        // console.log(responseBody);

        const savePromises = [].concat(picturePromises).concat(posterPromises).concat([
            axios.put(`${hostname}channel?id=${this.state.channel_id}`, responseBody, config)
        ])

        Promise.all(savePromises).then((results) => {
            // console.log(results);
            alert("Done");
        }).catch((e) => {
            // console.log(e);
            alert("Something went wrong");
        })

        // this.props.onToggle();
    }

    onExit() {
        this.channelName.value = _.get(this.state.refObj, 'name', defaultText);
        this.detail.value = _.get(this.state.refObj, 'detail', [defaultText]).join("\n\n");
        this.channelVideo.value = _.get(this.state, 'video', defaultText);
        this.channelLink.value = _.get(this.state, 'url', defaultText);

        this.setState((prevState) => {
            return {
                ...prevState,
                poster: [_.get(prevState.refObj, 'picture', '')],
                poster_file: [],
                picture: _.get(prevState.refObj, 'picture_large', []),
                picture_file: [],
                isLoad: true
            }
        })
        this.props.onToggle();
    }

    // componentDidUpdate() {
    //     console.log(this.state);
    // }

    onChangeTagState(tagName, value) {
        if(typeof this.state.tagsState[tagName] === "boolean") {
            this.setState((prevState) => {
                let new_tagsState = { ...prevState.tagsState };
                new_tagsState[tagName] = value;
                return ({
                    ...prevState,
                    tagsState: new_tagsState
                });
            })
        }
    }

    render () {
        const content = (this.state.isLoad) ? (
            <section>
                <div className="flex flex-aligns-item">
                    <Image
                        src={_.get(this.state, 'poster[0]', '')}
                        imgClass="chan-img"
                        rejectClass="chan-img"
                        isInit={this.state.isLoad}
                    />
                    <div>
                        <Input refI={(input) => this.channelName = input} text="CHANNEL NAME" placeholder="CHANNEL NAME" />
                    </div>
                </div>
                <hr className="thin" />
                <PictureUpload
                    text="UPLOAD PROFILE IMAGE"
                    isInit={this.state.isLoad}
                    srcs={this.state.poster}
                    showFilesNumber={false}
                    persistentImg={false}
                    onUpdate={(val, t) => {
                        if((this.state.poster.length > 0 && val[0] !== this.state.poster[0]) || (this.state.poster.length !== val.length)) {
                            this.setState((prevState, props) => {
                                return {
                                    ...prevState,
                                    'poster': [val[0]],
                                    'poster_file': t
                                }
                            })
                        }
                    }}
                    style={{'width': '100%'}}
                />
                <Input refI={(textarea) => this.detail = textarea} text="CHANNEL DETAIL" placeholder="CHANNEL DETAIL" isTextarea={true} />
                <Input refI={(input) => this.channelLink = input} text="URL" placeholder="URL" />
                <Input refI={(input) => this.channelVideo = input} text="YOUTUBE EMBED" placeholder="YOUTUBE EMBED" />
                <PictureUpload
                    text="UPLOAD PICTURES"
                    isMultiple={true}
                    isInit={this.state.isLoad}
                    srcs={this.state.picture}
                    showFilesNumber={true}
                    persistentImg={true}
                    onUpdate={(val, t) => {
                        this.setState((prevState, props) => {
                            return {
                                ...prevState,
                                'picture': val,
                                'picture_file': t
                            }
                        })
                    }}
                    style={{'width': '100%'}}
                />
                {
                    (enableTag) ? (
                        <div className="chan-tag">
                            <h1>TAG</h1>
                            <div className="tag-container">
                                {
                                    this.state.TAG_1.map((key, index) => {
                                        return (
                                            <Btn
                                                key={index}
                                                text={`${key}`}
                                                isInit={this.state.isLoad}
                                                initialState={this.state.tagsState[key]}
                                                classNameOn={`Btn tag Btn-active tag${(key.length === 0) ? ' empty' : ''}${(key.length > 7) ? ' long' : ''} `}
                                                classNameOff={`Btn tag ${(key.length === 0) ? ' empty' : ''}${(key.length > 7) ? ' long' : ''}`}
                                                callback={(isActive) => {this.onChangeTagState.bind(this)(key, isActive)}}
                                            />
                                        );
                                    })
                                }
                            </div>
                            <div className="tag-container mar-v-10">
                                {
                                    this.state.TAG_2.map((key, index) => {
                                        return (
                                            <Btn
                                                key={index}
                                                text={`${key}`}
                                                isInit={this.state.isLoad}
                                                initialState={this.state.tagsState[key]}
                                                classNameOn={`Btn tag Btn-active tag${(key.length === 0) ? ' empty' : ''}${(key.length > 7) ? ' long' : ''} `}
                                                classNameOff={`Btn tag ${(key.length === 0) ? ' empty' : ''}${(key.length > 7) ? ' long' : ''}`}
                                                callback={(isActive) => {this.onChangeTagState.bind(this)(key, isActive)}}
                                            />
                                        );
                                    })
                                }
                            </div>
                        </div>
                    ) : null
                }
                <footer>
                    <button className="bt">CANCEL</button>
                    <button className="bt blue" onClick={this.onSave}>SAVE</button>
                </footer>
            </section>
        ) : (
            <div style={{'fontSize': '30px', 'margin': 'auto', 'color': '#878787', 'textAlign': 'center'}}>
                <div style={{'margin': 'auto', 'width': '50px', 'display': 'inline-block', 'position': 'relative', 'top': '12px', 'marginLeft': '5px'}}>
                    <ReactLoading type={'bars'} color={'#878787'} height='40px' width='40px' />
                </div>
                Loading
                <div style={{'margin': 'auto', 'width': '50px', 'display': 'inline-block', 'position': 'relative', 'top': '12px', 'marginLeft': '5px'}}>
                    <ReactLoading type={'bars'} color={'#878787'} height='40px' width='40px' />
                </div>
            </div>
        );
        return (
            <div className="modal-container">
                <article className="edit-event basic-card-no-glow modal-main card-width channel-detail">
                    <button className="card-exit invisible square-round" role="event-exit" onClick={this.onExit.bind(this)}>
                        <img src="../../resource/images/X.svg" />
                    </button>
                    { content }
                </article>
                <div className="background-overlay"/>
            </div>
        )
    }
}

export default channelInfo;
