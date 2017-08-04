import React, { Component } from 'react';
import _ from 'lodash';
import autoBind from '../hoc/autoBind';
import EventItem from '../container/eventItem';
import './css/editEvent.css';

import AddList from './EditEvent2/AddList';
import Btn from './EditEvent2/Btn';
import DateAndTime from './EditEvent2/DateAndTime';
import CustomRadio from '../components/CustomRadio';
import PictureUpload from '../components/PictureUpload';
import MultipleChoice from '../components/MultipleChoice';

import { getCookie, objModStr } from '../actions/common';
import { hostname } from '../actions/index';
import { getCodeList, findInfoById } from '../actions/facultyMap';

import axios from 'axios';

function replaceIncorrectLink(str) {
    if(typeof(str) === "string") {
        if(str.indexOf("128.199.208.0/") === 0) str = str.replace("128.199.208.0/", hostname);
        else if(str.indexOf("cueventhub.com/") === 0) str = str.replace("cueventhub.com/", hostname)
        else if(str.indexOf("139.59.97.65:1111/") === 0) str = str.replace("139.59.97.65:1111/", hostname)
        return str;
    }
    return null;
}

class PopupButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isEnable: false
        }
        this.toggleState = this.toggleState.bind(this);
    }

    toggleState() {
        this.setState({
            ...this.state,
            isEnable: !this.state.isEnable
        })
    }

    render() {
        const style = {
            ...this.props.OuterStyle,
            'position': 'absolute',
            'zIndex': '500'
        }
        if(this.props.isRight) style['right'] = '0px';
        const PopUp = (this.state.isEnable) ? (
            <div style={style} className={this.props.OuterClass ? this.props.OuterClass : ''}>
                {this.props.obj}
            </div>
        ) : null;

        return (
            <div style={{'position': 'relative'}}>
                <button
                    className={`Btn Btn-Primary ${this.props.BtnClass ? this.props.BtnClass : ''}`}
                    style={{...this.props.BtnStyle}}
                    onClick={this.toggleState}>{this.props.text}</button>
                {PopUp}
            </div>
        );
    }
}

const DateButton = (props) => {
    return <PopupButton {...props} BtnClass="Btn-Small" obj={<DateAndTime {...props} />} />
}

class EditEvent extends Component {
    constructor(props) {
        super(props);
        const fieldState = {};
        FieldsName.forEach((item) => fieldState[item] = state[0].value);
        this.state = {
            'eventDate': [],
            'firstMeetDate': [],
            'recruitmentDate': [],
            'contact': [],
            'notes': [],
            'refs': {
                'files': [],
                'url': []
            },
            'tagsState': {
                'top': [TAG_1.map(() => false)],
                'bottom': [TAG_2.map(() => false)]
            },
            'fieldsState': fieldState,
            'enableQuestion': false,
            'isLoad': false,
            'enableRecruitment': false,
            'maxJoin': -1,
            'poster': [],
            'picture': [],
            'poster_file': [],
            'picture_file': [],
            'eventTitle': '',
            'eventLocation': '',
            'eventDetail': '',
            'outsiderAccessible': false,
            'admins': [],
            'selectedFaculty': {},
            'selectedYear': {},
            'refObject': {},
            'firstMeetTime': {
                'Start': '',
                'End': ''
            },
            'video': '',
            'uploadProgress': {
                'isUploading': false,
                'uploadStatus': {
                    'detail': false,
                    'pictures': {
                        'add': false,
                        'delete': false
                    },
                    'poster': false,
                    'admins': {
                        'add': false,
                        'delete': false
                    }
                }
            }
        }
        this.resizeTextArea = this.resizeTextArea.bind(this);
        this.onTextAreaChange = this.onTextAreaChange.bind(this);
        this.onChangeValue = this.onChangeValue.bind(this);
    }

    componentWillMount() {
        if(this.props.eventId && this.props.eventId.length > 0) {
            axios.get(`${hostname}event?id=${this.props.eventId}`).then((data) => data.data).then(
                (data) => {
                    console.log(data);
                    this.onSetValues.bind(this)(data);
                }
            ).catch((error) => {
                console.log(error);
                this.setState({
                    ...this.state,
                    'isLoad': true
                })
            })
        }
    }

    onSetValues(states) {
        if(typeof states === "undefined" || states === null) return;

        let new_state = { ...this.state };
        new_state.eventDate = {
            Dates: _.get(states, 'time_each_day', []).map((item) => convertItem(item)),
            Time: {
                Start: new Date(_.get(states, 'time_start', '')).toString().slice(16, 21),
                End: new Date(_.get(states, 'time_end', '')).toString().slice(16, 21)
            }
        }
        if(states.notes && states.notes.constructor === Array && states.notes.length === 2) {
            new_state.enableRecruitment = true;
            new_state.recruitmentDate = {
                Dates: _.get(states, 'notes[1].dates', []).map((item) => convertItem(item)),
                Time: {
                    Start: '',
                    End: ''
                }
            }
            new_state.firstMeetDate = {
                Dates: _.get(states, 'notes[0].content.dates', []).map((item) => convertItem(item)),
                Time: {
                    Start: '',
                    End: ''
                }
            }
        }
        new_state.tagsState = {
            top: TAG_1.map((item) => (states.tags.indexOf(item) !== -1)),
            bottom: TAG_2.map((item) => (states.tags.indexOf(item) !== -1))
        }
        const refs = _.get(states, 'refs', []);
        new_state.refs = {
            files: refs.filter((item) => item.note === "file"),
            url: refs.filter((item) => item.note === "url").map((item) => item.content)
        }
        new_state.fieldsState = {};
        FieldsName.forEach((item) => (item.length !== 0) ? new_state.fieldsState[item] = state[0].value : null)

        _.get(states, 'require_field', []).forEach((item) => {
            if(ServerToClientFields[item] !== "undefined") {
                new_state.fieldsState[ServerToClientFields[item]] = state[1].value;
            }
        })
        _.get(states, 'optional_field', []).forEach((item) => {
            if(ServerToClientFields[item] !== "undefined") {
                new_state.fieldsState[ServerToClientFields[item]] = state[2].value;
            }
        })
        new_state.contact = JSON.parse(_.get(states, 'contact_information', '[]')).map(
        (item) => {
            return {
                title: item.name,
                content: item.info,
                note: item.note
            }
        });
        new_state.maxJoin = states.joinable_amount;
        new_state.poster = [states.picture];
        new_state.picture = states.picture_large;
        new_state.isLoad = true;
        new_state.eventTitle = states.title;
        new_state.eventLocation = states.location;
        new_state.eventDetail = _.get(states, 'about', []).join("\n\n");
        new_state.admins = _.get(states, 'admins', []);
        new_state.outsiderAccessible = _.get(states, 'outsider_accessible', false);
        const fmTime = _.get(states, 'notes[0].content.time', '').split(' - ');
        new_state.firstMeetTime = {
            Start: fmTime[0],
            End: fmTime[fmTime.length - 1]
        };
        new_state.refObject = { ...states };

        const selectedYear = {};
        optionYear.forEach((item, index) => selectedYear[index] = BulletState[0].value);
        _.get(states, 'year_require', []).forEach((item, index) => selectedYear[index] = BulletState[1].value);
        new_state.selectedYear = selectedYear;

        const selectedFaculty = {};
        optionFaculty.forEach((item, index) => selectedFaculty[index] = BulletState[0].value);
        _.get(states, 'faculty_require', []).forEach((code) => {
            selectedFaculty[getCodeList().indexOf(code)] = BulletState[1].value;
        })
        new_state.selectedFaculty = selectedFaculty;
        new_state.video = _.get(states, 'video', '');

        this.firstMeet_Notes.value = _.get(states, 'notes[0].note', '');
        this.firstMeet_Location.value = _.get(states, 'notes[0].content.location', '');

        this.setState(new_state);
    }

    onSave() {
        const uploadPromises = [];
        this.setState((prevState) => {
            return {
                ...prevState,
                uploadProgress: {
                    ...prevState.uploadProgress,
                    isUploading: true
                }
            }
        });
        const uploadedObj = {};
        const { refObject } = this.state;
        const mapKeyword = {
            'title': 'eventTitle',
            'time_each_day': 'eventDate',
            'location': 'eventLocation',
            'about': 'eventDetail',
            'time_start': 'eventDate',
            'time_end': 'eventDate',
            'date_start': 'eventDate',
            'date_end': 'eventDate',
            'outsider_accessible': 'outsiderAccessible',
            'require_field': 'fieldsState',
            'optional_field': 'fieldsState',
            'refs': 'refs',
            'contact_information': 'contact',
            'tags': 'tagsState',
            'joinable_amount': 'maxJoin',
            'video': 'video'
        }

        uploadedObj["notes"] = [];
        if(this.state.enableRecruitment) {
            uploadedObj.notes.push({
                note: this.firstMeet_Notes.value,
                title: "FIRSTMEET",
                content: {
                    dates: this.state.firstMeetDate.Dates,
                    location: this.firstMeet_Location.value,
                    time: this.state.firstMeetTime.Start + " - " + this.state.firstMeetTime.End
                }
            });
            uploadedObj.notes.push({
                note: null,
                title: "RECRUITMENT DURATION",
                content: this.state.recruitmentDate.Dates
            })
        }

        const mapConvertFunc = {
            'time_each_day': (res) => res.Dates,
            'about': (res) => res.split("\n\n"),
            'time_start': (res) => {
                let start_date = res.Dates[0];
                if(start_date.constructor === Array) start_date = start_date[0];
                const time = res.Time.Start.split(":");
                return new Date(new Date(start_date).setHours(Number(time[0]), Number(time[1]), 0))
            },
            'time_end': (res) => {
                let end_date = res.Dates[res.Dates.length - 1];
                if(end_date.constructor === Array) end_date = end_date[1];
                const time = res.Time.End.split(":");
                return new Date(new Date(end_date).setHours(Number(time[0]), Number(time[1]), 0))
            },
            'date_start': (res) => {
                let start_date = res.Dates[0];
                if(start_date.constructor === Array) start_date = start_date[0];
                return new Date(new Date(start_date).setUTCHours(0, 0, 0));
            },
            'date_end': (res) => {
                let end_date = res.Dates[res.Dates.length - 1];
                if(end_date.constructor === Array) end_date = end_date[1];
                return new Date(new Date(end_date).setUTCHours(0, 0, 0));
            },
            'require_field': (res) => {
                let rArray = [];
                Object.keys(res).forEach((key) => {
                    if(res[key] === state[1].value) {
                        rArray.push(ClientToServerFields[key])
                    }
                })
                return rArray;
            },
            'optional_field': (res) => {
                let rArray = [];
                Object.keys(res).forEach((key) => {
                    if(res[key] === state[2].value) {
                        rArray.push(ClientToServerFields[key])
                    }
                })
                return rArray;
            },
            'refs': (res) => {
                let ref = [];
                res.url.forEach((item) => {
                    ref.push({
                        note: "url",
                        title: "url",
                        content: item
                    })
                })
                res.files.forEach((item) => {
                    ref.push(item);
                });
                return ref;
            },
            'contact_information': (res) => {
                return JSON.stringify(res.map((item) => {
                    return {
                        name: item.title,
                        info: item.content,
                        note: item.note
                    }
                }))
            },
            'tags': (res) => {
                let rTags = [];
                res.top.forEach((value, index) => {
                    if(value) rTags.push(TAG_1[index])
                })
                res.bottom.forEach((value, index) => {
                    if(value) rTags.push(TAG_2[index])
                })
                return rTags;
            }
        }
        const _this = this;

        Object.keys(refObject).forEach((key) => {
            compareSetDiff(key, mapKeyword[key], mapConvertFunc[key])
        })

        if(refObject.picture !== _.get(this.state, 'poster[0]', '')) {
            const oldPoster = new Set(refObject.picture);
            const newPoster = this.state.poster[0];

            if(!oldPoster.has(newPoster)) {
                if(!checkPicturesUrl(refObject.picture)) {
                    uploadedObj["picture"] = this.state.poster;
                }
            }
        }

        const config = {
            'headers': {
                'Authorization': ('JWT ' + getCookie('fb_sever_token')),
                'crossDomain': true
            }
        }

        let pictures = [];
        if(!_.get(refObject, 'picture_large', []).equals(_.get(this.state, 'picture'))) {
            //Do something
            const oldPicture = refObject.picture_large;
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

                uploadPromises.push(
                    new Promise((good, bad) => {
                        axios.delete(`${hostname}picture`, configs).then((data) => {
                            this.onChangeValue('uploadProgress.uploadStatus.pictures.delete', true);
                            return good(true);
                        }).catch((error) => {
                            console.log(error);
                            return bad(error);
                        })
                    })
                )
            } else {
                this.onChangeValue('uploadProgress.uploadStatus.pictures.delete', true);
            }

            const picture_file = _.get(this.state, 'picture_file', []);

            if(picture_file.length > 0) {
                const formData = new FormData();
                picture_file.forEach((file) => {
                    formData.append('pictures', file);
                })
                uploadPromises.push(new Promise((good, bad) => {
                    axios.post(`${hostname}picture?id=${this.props.eventId}&size=large&field=event`, formData, config).then(
                        (data) => {
                            this.onChangeValue('uploadProgress.uploadStatus.pictures.add', true);
                            return good(true);
                        }).catch((e) => {
                            bad(e)
                        })
                }))
            }

            // if(diffB.length > 0) {
            //     //TODO: UPDATING NEW PICTURES TO SERVER (DIFFERENT URL)
            //     //Actually should not be possible right now
            // } else {
            //     this.onChangeValue('uploadProgress.uploadStatus.picture.add', true);
            // }
        }

        //Poster Process
        const oldPoster = _.get(refObject, 'picture', "");
        let newPoster = _.get(this.state, 'poster', [""])
        if(newPoster.constructor === Array && newPoster.length > 0) newPoster = newPoster[0];

        if(oldPoster !== newPoster) {
            const posterPromises = [];

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
                    axios.post(`${hostname}picture?id=${this.props.eventId}&size=small&field=event`, formData, config)
                );
            }

            uploadPromises.push(new Promise((good, bad) => {
                Promise.all(posterPromises).then((datas) => {
                    this.onChangeValue('uploadProgress.uploadStatus.poster', true);
                    good(true);
                }).catch((e) => {
                    console.log(e);
                    bad(e);
                })
            }))
        }

        //Admin Process
        const oldAdmin = _.get(refObject, 'admins', []);
        const newAdmin = _.get(this.state, 'admins', []);

        if(!oldAdmin.equals(newAdmin)) {
            const deleteAdmins = oldAdmin.filter(function(x) { return newAdmin.indexOf(x) < 0 });
            const addAdmins = newAdmin.filter(function(x) { return oldAdmin.indexOf(x) < 0 });

            if(deleteAdmins.length > 0) {
                let deleteAdminPromises = []
                deleteAdmins.forEach((item) => {
                    deleteAdminPromises.push(axios.delete(`${hostname}admin/event/delete?id=${this.props.eventId}`,
                    {
                        ...config,
                        params: {
                            user: item
                        }
                    }))
                })
                uploadPromises.push(new Promise((good, bad) => {
                    Promise.all(deleteAdminPromises).then((result) => {
                        this.onChangeValue('uploadProgress.uploadStatus.admins.delete', true);
                        good(true);
                    }).catch((error) => {
                        console.log(error);
                        bad(error)
                    })
                }))
            } else {
                this.onChangeValue('uploadProgress.uploadStatus.admins.delete', true);
            }

            if(addAdmins.length > 0) {

                let addAdminPromises = []

                //REG_ID
                addAdmins.forEach((item) => {
                    addAdminPromises.push(axios.put(`${hostname}admin/event/add?id=${this.props.eventId}`, {
                        user: item
                    }, config))
                })

                uploadPromises.push(new Promise((good, bad) => {
                    Promise.all(addAdminPromises).then((result) => {
                        this.onChangeValue('uploadProgress.uploadStatus.admins.add', true);
                        good(true);
                    }).catch((error) => {
                        console.log(error);
                        bad(error);
                    })
                }))
            }
        } else {
            this.onChangeValue('uploadProgress.uploadStatus.admins.add', true);
        }

        /*Fields that need to use external api
            - poster
                - if original file is modified
                    - if url is not from server, then uploadedObj must have modified picture field
                    - else need to use api to delete picture
                - if this.state.poster_file length is not 0, then need to upload picture to server
            - picture
                - if original file is modified
                    - if urls is not from server then uploadedObj must have picture_large field
                    - else need to use api to delete pictures
                - if this.state.picture_file length is not 0, then need to upload picture to server
            - admin
                - If original list of admin is modified
                    - Need to find the deleted admin and use api to remove old admin
                    - Need tp find the added admin and use api to include new admin
        */
        uploadPromises.push(axios.put(`${hostname}event?id=${this.props.eventId}`, uploadedObj, config));

        Promise.all(uploadPromises).then(() => {
            alert("Uploaded Completed");
        }).catch((e) => {
            console.log(e);
        })

        function compareSetDiff(refName, stateName, convertFunc) {
            if(typeof convertFunc === "function") {
                if(typeof stateName !== "undefined" && refObject[refName] !== convertFunc(_this.state[stateName])) {
                    uploadedObj[refName] = convertFunc(_this.state[stateName]);
                }
            } else {
                if(typeof stateName !== "undefined" && refObject[refName] !== _this.state[stateName]) {
                    uploadedObj[refName] = _this.state[stateName];
                }
            }
        }
    }

    resizeTextArea(textArea) {
        textArea.style.height = 'auto';
        textArea.style.height = textArea.scrollHeight+'px';
    }

    onTextAreaChange() {
        this.resizeTextArea(this.textDetail);
    }

    onChangeValue(location, value) {
        this.setState((prevState) => {
            let new_state = {...prevState};
            objModStr(new_state, location, value);
            return new_state;
        })
    }

    onDateUpdate(val, refName) {
        if(refName === "eventDate" || refName === "firstMeetDate" || refName === "recruitmentDate") {
            this.onChangeValue(refName, val);
        }
    }

    onClickField(obj, text) {
        this.setState((prevState, props) => {
            const new_fields_state = {...prevState.fieldsState};
            new_fields_state[text] = obj.value;
            return {
                ...prevState,
                fieldsState: new_fields_state
            }
        })
    }

    componentDidUpdate() {
        console.log(this.state)
        this.onTextAreaChange();
    }

    render () {
        const TAG_TOP = TAG_1.map((key, index) => {
            return (
                <Btn
                    key={index}
                    text={`${key}`}
                    isInit={this.state.isLoad}
                    initialState={_.get(this.state, `tagsState.top[${index}]`, false)}
                    classNameOn={`Btn tag Btn-active tag${(key.length === 0) ? ' empty' : ''}${(key.length > 7) ? ' long' : ''} `}
                    classNameOff={`Btn tag ${(key.length === 0) ? ' empty' : ''}${(key.length > 7) ? ' long' : ''}`}
                    callback={(isActive) => {}}
                />);
        });
        const TAG_BOTTOM = TAG_2.map((key, index) => {
            return (
                <Btn
                    key={index}
                    text={`${key}`}
                    isInit={this.state.isLoad}
                    initialState={_.get(this.state, `tagsState.bottom[${index}]`, false)}
                    classNameOn={`Btn tag Btn-active tag${(key.length === 0) ? ' empty' : ''}${(key.length > 7) ? ' long' : ''} `}
                    classNameOff={`Btn tag ${(key.length === 0) ? ' empty' : ''}${(key.length > 7) ? ' long' : ''}`}
                    callback={(isActive) => {}}
                />);
        });

        const EnableRecruitment = this.state.isLoad && this.state.enableRecruitment;
        const overrideState = {
            'title': this.state.eventTitle,
            'location': this.state.eventLocation,
            'date_time': _.get(this.state, 'eventDate.Dates', []),
            'about': this.state.eventDetail.split("\n\n")[0],
            'poster': _.get(this.state, 'poster[0]', '')
        };

        return (
            <div className="modal-container">
                <article className="event-edit basic-card-no-glow modal-main mar-v-30 pad-30 card-width force-smooth">
                    <button className="card-exit invisible square-round" role="event-exit" onClick={this.props.toggle_pop_item}>
                        <img src="../../resource/images/X.svg" />
                    </button>
                    <nav className="fullwidth">
                        <h1>CREATE EVENT / EDIT EVENT</h1>
                    </nav>
                    <div className="Card-Demo fullwidth flex flex-center">
                        <EventItem
                            onToggle={() => {}}
                            onSetItem={() => {}}
                            noGlow="true"
                            overrideState={overrideState}
                        />
                    </div>
                    <div className="content">
                        <div data-role="meta">
                            <h2 className="NoBottom">BASIC INFO</h2>
                            <div className="fields flex">
                                <div className="left flex-order-1 flex-half">
                                    {
                                        (this.props.eventId) ? (
                                            <div className="mar-v-10 flex" style={{
                                                    'fontSize': '1.2em',
                                                    'fontWeight': 'bold',
                                                    'marginLeft': '10px'
                                                }}>
                                                {this.state.eventTitle}
                                            </div>
                                        ) : (
                                            <div className="mar-v-10 flex">
                                                <input
                                                    type="text"
                                                    className="flex-order-2 bottom-outline-1 border-focus-blue border-transition"
                                                    placeholder="EVENT NAME"
                                                    value={this.state.eventTitle}
                                                    onChange={(e) => {
                                                            this.onChangeValue('eventTitle', e.target.value);
                                                        }
                                                    }
                                                />
                                                <label className="flex-order-1" htmlFor="name">EVENT NAME</label>
                                                <span className="flex-order-3 note">Event Name can oly be set once.</span>
                                            </div>
                                        )
                                    }
                                    <div className="mar-v-10 flex">
                                        <input
                                            type="text"
                                            className="flex-order-2 bottom-outline-1 border-focus-blue border-transition"
                                            placeholder="EVENT LOCATION"
                                            value={this.state.eventLocation}
                                            onChange={(e) => this.onChangeValue('eventLocation', e.target.value)}
                                        />
                                        <label className="flex-order-1" htmlFor="location">EVENT LOCATION</label>
                                    </div>
                                    <DateButton
                                        initialDates={_.get(this.state, 'eventDate.Dates', [])}
                                        initialTimeStart={_.get(this.state, 'eventDate.Time.Start', '')}
                                        initialTimeEnd={_.get(this.state, 'eventDate.Time.End', '')}
                                        isLoad={this.state.isLoad}
                                        text="DATE & TIME"
                                        onUpdate={(val) => this.onDateUpdate.bind(this)(val, "eventDate")}
                                        controlEnable={true}
                                    />
                                </div>
                                <div className="right flex-order-2 flex-half">
                                    <div style={{'height': '100%', 'display': 'flex', 'justifyContent': 'center', 'alignItems': 'center'}}>
                                        <PictureUpload
                                            text="UPLOAD POSTER"
                                            isInit={this.state.isLoad}
                                            srcs={this.state.poster}
                                            showFilesNumber={false}
                                            persistentImg={false}
                                            onUpdate={(val, t) => {
                                                if((this.state.poster.length > 0 && val[0] !== replaceIncorrectLink(this.state.poster[0])) || (this.state.poster.length !== val.length)) {
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
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr className="fullwidth" />
                        <div data-role="detail" className="fields mar-v-10">
                            <h2>DETAIL</h2>
                            <div className="mar-v-10 flex">
                                <textarea
                                    className="flex-order-2 bottom-outline-1 border-focus-blue border-transition"
                                    placeholder="EVENT DETAIL"
                                    value={this.state.eventDetail}
                                    ref={(textarea) => this.textDetail = textarea}
                                    onChange={
                                        () => {
                                            this.onTextAreaChange();
                                            this.onChangeValue('eventDetail', this.textDetail.value);
                                        }
                                    }
                                />
                                <label className="flex-order-1" htmlFor="name">EVENT DETAIL</label>
                            </div>
                            <div className="mar-v-10 flex">
                                <input
                                    type="text"
                                    className="flex-order-2 bottom-outline-1 border-focus-blue border-transition"
                                    placeholder="URL"
                                    value={this.state.video}
                                    onChange={(e) => this.onChangeValue('video', e.target.value)}
                                />
                                <label className="flex-order-1" htmlFor="location">VIDEO (YOUTUBE EMBED)</label>
                            </div>
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
                            <div className="addList flex">
                                <AddList
                                    text="ADD CONTACT"
                                    isLoad={this.state.isLoad}
                                    children={this.state.contact}
                                    mode={1}
                                    placeholder={["NAME", "CONTACT INFO", "NOTE"]}
                                    onUpdate={(val) => this.onChangeValue('contact', val)}
                                />
                                <AddList
                                    isLoad={this.state.isLoad}
                                    children={this.state.refs.files}
                                    text="ADD FILE (URL)"
                                    mode={1}
                                    placeholder={["FILE NAME", "URL"]}
                                    onUpdate={(val) => this.onChangeValue('refs.files', val)}
                                />
                                <AddList
                                    isLoad={this.state.isLoad}
                                    children={this.state.refs.url}
                                    text="ADD URL"
                                    mode={0}
                                    placeholder="URL"
                                    onUpdate={(val) => this.onChangeValue('refs.url', val)}
                                />
                            </div>
                        </div>
                        <hr className="fullwidth" />
                        <div data-role="tags" className="fields">
                            <h2>TAGS</h2>
                            <div className="tag-container">
                                { TAG_TOP }
                            </div>
                            <hr />
                            <div className="tag-container">
                                { TAG_BOTTOM }
                            </div>
                        </div>
                        <hr className="fullwidth" />
                        <div data-role="recruitment" className="fields">
                            <h2>RECRUITMENT AND FIRSTMEET</h2>
                            <Btn
                                text="ENABLE RECRUITMENT"
                                classNameOn="Btn Btn-Primary Btn-active"
                                isInit={this.state.isLoad}
                                initialState={this.state.enableRecruitment}
                                classNameOff="Btn Btn-Primary"
                                callback={(isActive) => {this.onChangeValue('enableRecruitment', isActive);}}
                            />
                            <hr />
                            <div className={`firstmeet ${EnableRecruitment ? '' : 'display-none'}`}>
                                <div>
                                    <h3>FIRSTMEET</h3>
                                    <div style={{'display': 'flex', 'flexDirection': 'row', 'flexWrap': 'wrap', 'alignItems': 'center', 'position': 'relative', 'top': '-20px'}}>
                                        <div className="mar-v-10 flex" style={{'width': 'calc(100% - 210px)'}}>
                                            <input
                                                ref={(input) => this.firstMeet_Location = input}
                                                type="text"
                                                className="flex-order-2 bottom-outline-1 border-focus-blue border-transition"
                                                placeholder="LOCATION"
                                                />
                                            <label className="flex-order-1" htmlFor="name">LOCATION</label>
                                        </div>
                                        <DateButton
                                            initialDates={_.get(this.state, 'firstMeetDate.Dates', [])}
                                            initialTimeStart={_.get(this.state, 'firstMeetDate.Time.Start', '')}
                                            initialTimeEnd={_.get(this.state, 'firstMeetDate.Time.End', '')}
                                            isLoad={this.state.isLoad}

                                            text="DATE & TIME"
                                            onUpdate={(val) => this.onDateUpdate.bind(this)(val, "firstMeetDate")}
                                            isRight={true} />
                                        <div className="mar-v-10 flex" style={{'width': '100%', 'position': 'relative', 'top': '-20px'}}>
                                            <input
                                                ref={(input) => this.firstMeet_Notes = input}
                                                type="text"
                                                className="flex-order-2 bottom-outline-1 border-focus-blue border-transition"
                                                placeholder="NOTES"
                                                />
                                            <label className="flex-order-1" htmlFor="name">NOTES</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="moveUp-50">
                                    <h3>RECRUITMENT DURATION</h3>
                                    <DateButton
                                        initialDates={_.get(this.state, 'recruitmentDate.Dates', [])}
                                        isLoad={this.state.isLoad}

                                        text="DATES"
                                        enableTime={false}
                                        initialMode={2}
                                        onUpdate={(val) => this.onDateUpdate.bind(this)(val, "recruitmentDate")} />
                                </div>
                                <hr className="moveUp-50"/>
                            </div>
                            <div className={(EnableRecruitment) ? "moveUp-50" : ""}>
                                <h3>PARTICIPANTS FILTER</h3>
                                <div className="mar-v-10 flex" style={{'width': '100%', 'display': 'flex', 'flexDirection': 'row', 'alignItems': 'center'}}>
                                    <Btn
                                        text="CLOSE WHEN FULL"
                                        classNameOn="Btn Btn-Primary Btn-active Btn-Small flex-order-1"
                                        initialState={this.state.maxJoin !== -1}
                                        isInit={this.state.isLoad}
                                        classNameOff="Btn Btn-Primary Btn-Small flex-order-1"
                                        callback={(isActive) => {
                                            if(isActive) this.onChangeValue('maxJoin', 1);
                                            else this.onChangeValue('maxJoin', -1);
                                        }} />
                                    <div
                                        className={(this.state.maxJoin === -1) ? 'display-none' : 'flex-order-2'}
                                        style={{'width': '100%', 'display': 'flex', 'flexDirection': 'column', 'marginLeft': '15px'}}>
                                        <input
                                            type="number"
                                            className="flex-order-2 bottom-outline-1 border-focus-blue border-transition"
                                            placeholder="NUMBER OF PARTICIPANTS"
                                            ref={(input) => this.firstMeet_MaxNum = input}
                                            onChange={() => { this.onChangeValue('maxJoin', parseInt(this.firstMeet_MaxNum.value));}}
                                            value={this.state.maxJoin}
                                            />
                                        <label className="flex-order-1" htmlFor="name">NUMBER OF PARTICIPANTS</label>
                                    </div>
                                </div>
                                <div className="flex" style={{'flexDirection': 'row'}}>
                                    <Btn
                                        text="ONLY CHULA"
                                        classNameOn="Btn Btn-Primary Btn-active"
                                        isInit={this.state.isLoad}
                                        initialState={!this.state.outsiderAccessible}
                                        classNameOff="Btn Btn-Primary"
                                        callback={(isActive) => {}} />
                                    <PopupButton
                                        BtnStyle={{'position': 'relative', 'left': '-5px'}}
                                        BtnClass="Btn-Block" text="FACULTY"
                                        OuterClass="basic-card-no-glow pad-20"
                                        obj={
                                            <MultipleChoice
                                                state={BulletState}
                                                options={optionFaculty}
                                                isLoad={this.state.isLoad}
                                                initialValue={this.state.selectedFaculty}
                                                maxActive={999}
                                                containerClass="FormChoice circle"
                                                onUpdate={(res) => this.onChangeValue('selectedFaculty', convertMultipleChoice(res))}
                                            />
                                        }
                                        OuterStyle={{
                                            'height': '300px',
                                            'overflow': 'scroll',
                                            'maxWidth': '200px',
                                            'minWidth': '200px',
                                            'width': '200px',
                                            'transform': 'translateX(-50%)',
                                            'left': '50%'}}
                                    />
                                    <PopupButton
                                        BtnClass="Btn-Block"
                                        text="YEAR"
                                        OuterClass="basic-card-no-glow pad-20"
                                        obj={
                                            <MultipleChoice
                                                state={BulletState}
                                                options={optionYear}
                                                isLoad={this.state.isLoad}
                                                initialValue={this.state.selectedYear}
                                                maxActive={999}
                                                containerClass="FormChoice circle"
                                                onUpdate={(res) => this.onChangeValue('selectedYear', convertMultipleChoice(res))}
                                            />}
                                        OuterStyle={{
                                            'position': 'absolute',
                                            'zIndex': '500',
                                            'height': '150px',
                                            'overflow': 'scroll',
                                            'maxWidth': '60px',
                                            'minWidth': '60px',
                                            'width': '60px',
                                            'transform': 'translateX(calc(-50% + 5px))',
                                            'left': '50%'}}
                                    />
                                </div>
                            </div>
                        </div>
                        <hr className={(EnableRecruitment) ? "fullwidth moveUp-50" : "fullwidth"} />
                        <div data-role="fields" className={(EnableRecruitment) ? "moveUp-50" : ""}>
                            <h2>REQUIRED INFORMATION</h2>
                            <div className="fields-selected">
                                {
                                    FieldsName.map((text, index) => {
                                        return (
                                            <CustomRadio
                                                state={state}
                                                text={text}
                                                key={index}
                                                onClick={(val) => this.onClickField.bind(this)(val, text) }
                                                isLoad={this.state.isLoad}
                                                initialValue={this.state.fieldsState[text]}
                                            />
                                        );
                                    })
                                }
                            </div>
                            <div>
                                <span style={{
                                        fontSize: '1.5em',
                                        display: 'block'
                                    }}>Note</span>
                                <span>The circle state is required field. The square state is optional field</span>
                            </div>
                            <hr />
                        </div>
                        <div className={(EnableRecruitment) ? "moveUp-50" : ""}>
                            <div><strong>Note</strong> Please save the form before continue</div>
                            <Btn text="ENABLE QUESTION" classNameOn="Btn Btn-Primary Btn-active" isInit={true} classNameOff="Btn Btn-Primary" callback={(isActive) => {
                                    this.onChangeValue("enableQuestion", isActive);
                                }} />
                            {
                                (this.state.enableQuestion) ? (<button className="Btn Btn-Primary">CREATE/EDIT FORM ></button>) : null
                            }
                        </div>
                        <hr className={(EnableRecruitment) ? "fullwidth moveUp-50" : "fullwidth"} />
                        <div data-role="tell-more" className={(EnableRecruitment) ? "fields moveUp-20" : "fields"}>
                            <div className="mar-v-10 flex">
                                <span><b>TELL MORE </b>THIS TEXT WILL SHOW UP AFTER THEY JOINED THIS EVENT.</span>
                                <input
                                    type="text"
                                    className="flex-order-2 bottom-outline-1 border-focus-blue border-transition"
                                    placeholder="SHOW TEXT"
                                    ref={(input) => this.afterJoin = input}
                                />
                                <label className="flex-order-1" htmlFor="date">MESSAGE</label>
                                <span className="flex-order-3 note">If leave blank, no message will popup</span>
                            </div>
                        </div>
                        <hr className="fullwidth" />
                        <div data-role="admin" className="fields">
                            <h3>ADD ADMIN</h3>
                            <AddList
                                text="ADD ADMIN"
                                mode={2}
                                placeholder={"STUDENT ID"}
                                onUpdate={(val) => this.onChangeValue('admins', val)}
                                isLoad={this.state.isLoad}
                                children={this.state.admins}
                            />
                        </div>
                        <hr className="fullwidth" />
                        <footer>
                            <button className="bt">CANCEL</button>
                            <button className="bt" onClick={this.onSave.bind(this)}>SAVE</button>
                            <button className="bt blue">PUBLIC</button>
                        </footer>
                    </div>
                </article>
                <div className="background-overlay"/>
            </div>
        )
    }
}

EditEvent.defaultProps = {
    'eventId': "595ef6c7822dbf0014cb821c"
}

export default autoBind(EditEvent);

function convertItem(item) {
    if(item.constructor === Array && item.length === 2) {
        if(typeof item[0].getFullYear === "function" && typeof item[1].getFullYear === "function")
            return item;
        else
            return [new Date(item[0]), new Date(item[1])]
    }
    else if(typeof item.getFullYear === "function") return item;
    return new Date(item);
}

function convertMultipleChoice(response) {
    let obj = {}
    response.forEach((item) => {
        obj[item.index] = item.value;
    })
    return obj;
}

function checkPicturesUrl(url) {
    if(typeof url === "string") return (url.indexOf("https://api.cueventhub.com/picture/") === 0)
    return false;
}

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

const state = [{
        'type': 'none',
        'value': 'none'
    }, {
        'type': 'circle',
        'value': 'require'
    }, {
        'type': 'square',
        'value': 'optional'
}];

const BulletState = [{
    'type': 'none',
    'value': 'false'
}, {
    'type': 'circle',
    'value': 'true'
}];

const ServerToClientFields = {
    "firstName" : "FIRSTNAME (EN)",
    "lastName" : "LASTNAME (EN)",
    "firstNameTH" : "FIRSTNAME (TH)",
    "lastNameTH": "LASTNAME (TH)",
    "nick_name" : "NICKNAME",
    "gender" : "GENDER",
    "email": "E-MAIL",
    "birth_day" : "BIRTHDAY",
    "major" : "MAJOR",
    "regId" : "REG ID",
    "shirt_size" : "T-SHIRT SIZE",
    "allergy" : "FOOD ALLERGIES",
    "disease" : "MEDICAL PROBLEM",
    "lineId" : "LINE ID",
    "twitterUsername": "TWITTER ID",
    "phone" : "MOBILE NUMBER",
    "dorm_room" : "DORM ROOM",
    "dorm_building" : "DORM BUILDING",
    "dorm_bed" : "DORM BED",
    "picture" : "PICTURE (SMALL)",
    "picture_200px" : "PICTURE (LARGE)"
}

const ClientToServerFields = {}
Object.keys(ServerToClientFields).forEach((key) => {
    ClientToServerFields[ServerToClientFields[key]] = key;
})

const optionYear = [
    "ALL",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8"
]

const optionFaculty = getCodeList().map((item) => {
    return findInfoById(item).FullName
});

const FieldsName = Object.keys(ServerToClientFields).map((key) => ServerToClientFields[key]).concat(["", "", ""]);

/*
Note
ENABLE QUESTION SHOULD BE SPLIT INTO MULTIPLE CASES
- CREATE NEW EVENT
    - WITHOUT EXISTING FORM -> (NEW) AFTER SAVE OR SUBMIT
- EDIT EVENT
    - WITH EXISTING FORM -> (EDIT) AFTER PRESSED BUTTON
    - WITHOUT EXISTING FORM -> (NEW) AFTER PRESSED BUTTON
*/
