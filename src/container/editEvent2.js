import React, { Component } from 'react';
import autoBind from '../hoc/autoBind';
import EventItem from '../container/eventItem';
// import './css/editEvent2.css';
import axios from 'axios';
import { getCookie, objModStr } from '../actions/common';
import CustomRadio from '../components/CustomRadio';
import DatePicker from '../components/datePicker';
import TimeInput from '../components/TimeInput';
import { fullId, findInfoById } from '../actions/facultyMap';
import { hostname } from '../actions/index';
import series from '../functions/PromiseSeries';
import PictureUpload from '../components/PictureUpload';

import Btn from '../components/Btn';
import AddAdmin from './EditEvent2/AddAdmin';
import AddList from './EditEvent2/AddList';

import _ from 'lodash';

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

//date_time format
/*
    {
        'dates': [...],
        'time': {
            'start': [String?],
            'end': [String?]
        }
    }
*/

/* refs and notes
    Sub event (Not enable yet)
    {
        'title': '...',
        'content': {
            'location': <String>,
            'dates': [<Date()>],
            'time': <String>
        },
        'note': <String>
    }

    FIRSTMEET format
    {
        'title': 'FIRSTMEET',
        'content': {
            'location': <String>,
            'dates': [<Date()>],
            'time': <String>
        },
        'note': <String>
    }

    refs
    {
        'title': <String>
        'content': <String>
        'note': <String>
    }
*/

/*
form on put/post

{
    'title': <String>,
    'channel': <String of ID>,
    'about': [<String>],
    'picture': <String>,
    'picture_large': [<String>],
    'year_require': [<String>],
    'location': <String>,
    'date_start': Date(),
    'date_end': Date(),
    'contact_information': [{
        'name': <String>,
        'info': <String>,
        'note': <String>
    }],
    'tags': [<String>],
    'time_start': Date(),
    'time_end': Date(),
    'optional_field': [<String>],
    'require_field': [<String>],
    'notes': [{ //for sub event and notes
        'title': 'FIRSTMEET',
        'content': {
            'location': <String>,
            'dates': [Dates],
            'time': <String>
        },
        'note': <String>
    }, {
        'title': <String>,
        'content': <String>,
        'note': <String>
    }],
    'refs': [{
        'title': 'url',
        'content': <String>,
        'note': 'url'
    }, {
        'title': <String>,
        'content': <String>,
        'note': 'file'
    }] // for files and url
}

*/

const defaultDate = {
    'dates': [],
    'time': {
        'start': '',
        'end': ''
    }
}

function replaceIncorrectLink(str) {
    if(typeof(str) === "string") {
        if(str.indexOf("128.199.208.0/") === 0) str = str.replace("128.199.208.0/", hostname);
        else if(str.indexOf("cueventhub.com/") === 0) str = str.replace("cueventhub.com/", hostname)
        else if(str.indexOf("139.59.97.65:1111/") === 0) str = str.replace("139.59.97.65:1111/", hostname)
        return str;
    }
    return null;
}

const defaultState = {
    'event_id': "596f5d624194e40014c07d99",
    'isLoading': true,
    'old': {
        'title': '',
        'about': '',
        'channel': '',
        'video': '',
        'location': '',
        'date_start': '',
        'date_end': '',
        'picture': '',
        'picture_large': [],
        'year_require': '',
        'faculty_require': '',
        'tags': '',
        'forms': ''
    },
    'new': {
        'title': '',
        'about': '',
        'channel': '',
        'video': '',
        'location': '',
        'date_time': defaultDate,
        'picture': '',
        'picture_large': '',
        'year_require': '',
        'faculty_require': '',
        'tags': '',
        'forms': '',
        'firstmeet': {
            'date': null
        }
    },
    'enableRecruitment': false,
    'enableForm': false,
    'option': {
        'contact': [],
        'time_start': '',
        'time_end': '',
        'tags_1': TAG_1.map(() => false),
        'tags_2': TAG_2.map(() => false),
        'fields': [],
        'contact': [],
        'url': [],
        'file': [],
        'recruitment': {
            'firstmeet': {
                'location': '',
                'note': '',
                'date': '',
                'closeWhenFull': false
            },
            'recruitmentDuration': [],
            'filter': {
                'onlyChula': false,
                'faculty': [],
                'year': []
            }
        },
        'picture_file': null,
        'picture_large_file': null
    }
}

class EditEvent extends Component {
    constructor(props) {
        super(props);

        this.state = defaultState;

        this.onKeyPressed = this.onKeyPressed.bind(this);
        this.save = this.save.bind(this);
        this.cancel = this.cancel.bind(this);
        this.onDateSet = this.onDateSet.bind(this);
        this.onSelectedPoster = this.onSelectedPoster.bind(this);
        this.resizeTextArea = this.resizeTextArea.bind(this);
        this.toggleRecruitment = this.toggleRecruitment.bind(this);
        this.onTagChange = this.onTagChange.bind(this);
        this.onClickField = this.onClickField.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({updated: nextProps.updated});
    }

    onChangeText(event, location) {
        let new_state = {...this.state};
        objModStr(new_state, location, event.target.value);
        this.setState({
            ...new_state
        });
    }

    onDateSet(dateList) {
        let checkNextDate = (today, nextDay) => {
            let tmp = new Date(nextDay);
            tmp.setDate(nextDay.getDate() - 1);
            return today.toISOString().slice(0,10) === tmp.toISOString().slice(0,10);
        }

        dateList = dateList.sort((a, b) => {
            if(a > b) return 1;
            if(a < b) return -1;
            return 0;
        });

        let dateChop = [];

        if(dateList.length === 0) dateChop = [];
        else if(dateList.length === 1) dateChop = dateList;
        else {
            let start = dateList[0];
            let end = dateList[0];

            for(let i = 1; i < dateList.length; i++) {
                if(checkNextDate(end, dateList[i]) && i !== dateList.length-1) {
                    end = dateList[i];
                } else {
                    if(i === dateList.length - 1) {
                        if(checkNextDate(end, dateList[i])) end = dateList[i];
                    }
                    if(start.toISOString().slice(0,10) === end.toISOString().slice(0,10)) dateChop.push(start);
                    else dateChop.push([start, end]);
                    start = dateList[i];
                    end = dateList[i];
                }
                if(i === dateList.length - 1) {
                    if(start.toISOString().slice(0,10) === end.toISOString().slice(0,10)) {
                        if(dateChop[dateChop.length-1].constructor === Array ) {
                            if((dateChop[dateChop.length-1][1].toISOString().slice(0,10) !== start.toISOString().slice(0,10))) {
                                dateChop.push(start);
                            }
                        }
                        else if(dateChop[dateChop.length-1].toISOString().slice(0,10) !== start.toISOString().slice(0,10)) {
                            dateChop.push(start);
                        }
                    }
                }
            }
        }

        this.setState({
            ...this.state,
            'new': {
                ...this.state.new,
                'date_time': {
                    ...this.state.new.date_time,
                    'dates': dateChop,
                }
            }
        })
        //correct dateChop

    }

    componentWillMount() {

        axios.get(`${hostname}event?id=${this.state.event_id}&stat=false`, { headers: { 'crossDomain': true }})
        .then((data) => data.data).then((data) => {
            let ttmp = data.time_each_day.map((item) => {
                if(item.constructor === Array) return ([new Date(item[0]), new Date(item[1])]);
                return new Date(item);
            })
            let new_option = { ...this.state.option }
            if(data.notes.length  > 0) {
                new_option = {
                    ...this.state.option,
                    'recruitment': {
                        ...this.state.option.recruitment,
                        'firstmeet': {
                            ...this.state.option.recruitment.firstmeet,
                            'location': data.notes[0].content.location,
                            'note': data.notes[0].note,
                            'date': new Date(data.notes[0].content.dates[0]),
                            'closeWhenFull': data.notes[0].content.closeWhenFull
                        },
                        'recruitmentDuration': [new Date(data.notes[1].content[0]), new Date(data.notes[1].content[data.notes[1].content.length - 1])]
                    }
                }
            }

            this.setState({
                ...this.state,
                'old': {
                    ...data
                },
                'new': {
                    ...this.state.new,
                    'title': data.title,
                    'about': data.about.join("\n\n"),
                    'channel': data.channel,
                    'video': data.video,
                    'location': data.location,
                    'date_time': {
                        'dates': ttmp,

                    },
                    'picture': data.picture,
                    'picture_large': data.picture_large,
                    'year_require': data.year_require,
                    'faculty_require': data.faculty_require,
                    'tags': data.tags,
                    'forms': data.forms,
                },
                'isLoading': false,
                'enableRecruitment': (data.notes.length > 0),
                'option': new_option
            })
            this.resizeTextArea("about");
        }, (error) => {
            //console.log("get event error");
        });
    }

    // componentDidUpdate() {
    //     console.log(this.state);
    // }

    onClickField(obj) {
        let new_field = [...this.state.option.fields]
        const index = new_field.findIndex((item) => {
            return item.text === obj.text
        })
        if(index === -1) {
            new_field.push(obj);
        } else {
            new_field[index] = obj
        }

        this.setState({
            ...this.state,
            option: {
                ...this.state.option,
                fields: new_field
            }
        });
    }

    onKeyPressed() {
        const newState = {
            ...this.state,
            'new': {
                ...this.state.new,
                'title': (this.refs.title) ? this.refs.title.value : '',
                'about': (this.refs.about) ? this.refs.about.value : '',
                'channel': (this.refs.channel) ? this.refs.channel.value : '',
                'video': (this.refs.video) ? this.refs.video.value : '',
                'location': (this.refs.location) ? this.refs.location.value : '',
                'date_time': this.state.new.date_time,
                'picture': (this.refs.picture) ? this.refs.picture.value : this.state.new.picture,
                'picture_large': (this.refs.picture_large) ? this.refs.picture_large.value : '',
                'year_require': (this.refs.year_require) ? this.refs.year_require.value : '',
                'faculty_require': (this.refs.faculty_require) ? this.refs.faculty_require.value : '',
                'tags': (this.refs.tags) ? this.refs.tags.value : '',
                'forms': (this.refs.forms) ? this.refs.forms.value : ''
            }
        };
        this.setState(newState);
    }

    save() {

        let config = {
            'headers': {
                'Authorization': ('JWT ' + getCookie('fb_sever_token')),
                'crossDomain': true
            }
        }

        //finish
        const date_start = (this.state.new.date_time && this.state.new.date_time.dates[0].constructor === Array) ? new Date(this.state.new.date_time.dates[0][0]) : new Date(this.state.new.date_time.dates[0])
        const date_end = (this.state.new.date_time && this.state.new.date_time.dates[this.state.new.date_time.dates.length-1].constructor === Array) ? new Date(this.state.new.date_time.dates[this.state.new.date_time.dates.length-1][1]) : new Date(this.state.new.date_time.dates[this.state.new.date_time.dates.length-1]);

        const time_s = this.state.option.time_start.split(":");
        const time_e = this.state.option.time_end.split(":");
        let time_start = new Date(date_start);
        let time_end = new Date(date_end);
        if(time_s.length === 2) time_start.setHours(Number(time_s[0]), Number(time_s[1]), 0);
        if(time_e.length === 2) time_end.setHours(Number(time_e[0]), Number(time_e[1]), 0);

        const contact = this.state.option.contact;
        let refs = [];
        this.state.option.file.forEach((item) => refs.push({...item, 'note': 'file'}));
        this.state.option.url.forEach((item) => refs.push({'title': 'url', 'content': item, 'note': 'url'}));

        const optional_field = this.state.option.fields.filter((item) => {
            return item.value === "optional";
        }).map((item) => item.text)
        const require_field = this.state.option.fields.filter((item) => {
            return item.value === "require";
        }).map((item) => item.text)

        let notes = (this.state.enableRecruitment) ? (
            [{
                'title': 'FIRSTMEET',
                'content': {
                    'location': this.state.option.recruitment.firstmeet.location,
                    'dates': [new Date(this.state.option.recruitment.firstmeet.date)],
                    'time': null,
                    'closeWhenFull': this.state.option.recruitment.firstmeet.closeWhenFull
                },
                'note': this.state.option.recruitment.firstmeet.note
            }, {
                'title': 'Recruitment Duration',
                'content': this.state.option.recruitment.recruitmentDuration,
                'note': null
            }]
        ) : []

        let tags = TAG_1.filter((item, index) => this.state.option.tags_1[index]).concat(TAG_2.filter((item, index) => this.state.option.tags_2[index]));

        let responseBody = {
            ...this.state.old,
            'date_start': date_start,
            'date_end': date_end,
            'time_start': time_start,
            'time_end': time_end,
            'time_each_day': this.state.new.date_time.dates,
            'contact_information': contact,
            'notes': notes,
            'refs': refs,
            'optional_field': optional_field,
            'require_field': require_field,
            'tags': tags,
            'picture': this.state.new.picture,
            'picture_large': this.state.new.picture_large
        }
        /*Picture Process --- must happen sometime after upload form to server complete*/
        let _this = this;

        function overallPictureProcess(id) {
            let overall_process = [0, 0];
            pictureProcess("picture_file", "small", 0);
            pictureProcess("picture_large_file", "large", 1);

            function praseId(str) {
                if(str.indexOf("139.59.97.65:1111/picture/") === 0) {
                    return str.replace("139.59.97.65:1111/picture/", "");
                } else if(str.indexOf("http://139.59.97.65:1111/picture/") === 0) {
                    return str.replace("http://139.59.97.65:1111/picture/", "");
                }
                return str;
            }

            function pictureProcess(refName, size, processIndex) {
                size = size || "large";
                let process_inner = 0;
                const configs = {
                    ...config,
                    onUploadProgress: (progressEvent) => {
                        process_inner = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
                        overall_process[processIndex] = process_inner;
                        //console.log(progressEvent.target.requestURL)
                        //console.log([...overall_process]);
                    }
                }

                const files = _this.state.option[refName];

                let data = new FormData();
                if(files) {
                    for(let i = 0; i < files.length; i++) {
                        data.append('pictures', files[i]);
                    }
                    axios.post(`${hostname}picture?field=event&size=${size}&id=${id}`, data, configs).then((res) => {
                        //console.log(res);
                    }).catch((err) => {
                        //console.error(err);
                    })
                }
            }
            return true;
        }

        if(this.state.event_id) {
            overallPictureProcess(this.state.event_id);
            axios.put(`${hostname}event?id=${this.state.event_id}`, responseBody, config).then((response) => {
                return true;
            }).catch((err) => {
                console.error(err);
                return false;
            })
        } else {
            axios.post(`${hostname}event`, responseBody, config).then((response) => {
                return response._id;
            }).then((id) => {
                if(typeof(id) === "string") {
                    overallPictureProcess(id);
                }
            })
        }

        this.props.toggle_pop_item();
    }

    onSelectedPoster() {
        const input = this.refs["poster"]
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
                        'picture': e.target.result
                    }
                })
            }


            reader.readAsDataURL(input.files[0]);
        }
    }

    cancel() {
        this.setState(defaultState);
        this.props.toggle_pop_item();
    }

    resizeTextArea(refName) {
        let textArea = this.refs[refName];
        textArea.style.height = 'auto';
        textArea.style.height = textArea.scrollHeight+'px';
    }

    toggleRecruitment() {
        this.setState({
            ...this.state,
            'enableRecruitment': !this.state.enableRecruitment
        });
    }

    onTagChange(no, isActive, index) {
        const referList = (no === 1) ? 'tags_1' : 'tags_2';
        let new_option = {
            ...this.state.option
        }
        new_option[referList] = this.state.option[referList].map((item, i) => {
                    if(i === index) return isActive;
                    return item;
                });
        this.setState({
            ...this.state,
            'option': new_option
        })
    }

    render () {
        const firstMeetDate = (this.state.new.firstmeet.date) ? new Date(this.state.new.firstmeet.date).toString() : null;
        let firstMeetDateStr = (firstMeetDate !== null) ? (`${firstMeetDate.slice(8,10)} ${firstMeetDate.slice(4,7)} ${firstMeetDate.slice(13,15)}`) : 'Date';
        const tmpppp = _.get(this.state.old, 'notes[0].content.dates[0]', false);
        const firstMeetDateArray = (tmpppp) ? [new Date(tmpppp)] : [];

        return (
            <div className="modal-container">
                <article className="edit-event basic-card-no-glow modal-main card-width">
                    <button className="card-exit invisible square-round" role="event-exit" onClick={this.cancel.bind(this)}>
                        <img src="../../resource/images/X.svg" />
                    </button>
                    <h2>CREATE EVENT / EDIT EVENT</h2>
                    <p className="l1"></p>
                    <div className="flex">
                        <div className="margin-auto">
                            <EventItem noGlow="true" overrideState={{
                                    'title': this.state.new.title,
                                    'location': this.state.new.location,
                                    'date_time': this.state.new.date_time.dates,
                                    'about': this.state.new.about.split("\n\n")[0],
                                    'poster': this.state.new.picture
                                }} />
                        </div>
                    </div>
                    <p className="l1"></p>
                    <div className="flex">
                        <div className="w55">
                            <h1>EVENT NAME</h1> <input ref="title" type="text" value={this.state.new.title} onChange={this.onKeyPressed} placeholder="" />
                            <h1>EVENT LOCATION</h1> <input ref="location" type="text" placeholder="" value={this.state.new.location} onChange={this.onKeyPressed} />
                        </div>
                        <div ref="addPoster">
                            <h1>ADD MAIN POSTER</h1>
                            <PictureUpload text="Upload Poster" isInit={!this.state.isLoading} srcs={[replaceIncorrectLink(this.state.old.picture)]} showFilesNumber={false} persistentImg={false} onUpdate={(val, t) => {
                                    if(val[0] !== replaceIncorrectLink(this.state.new.picture)) {
                                        this.setState({
                                            ...this.state,
                                            'new': {
                                                ...this.state.new,
                                                'picture': val[0]
                                            },
                                            'option': {
                                                ...this.state.option,
                                                'picture_file': t
                                            }
                                        })
                                    }
                                }} style={{'width': '100%'}}/>
                        </div>
                    </div>
                    <div>
                        <h1>DATE & TIME</h1>
                        <div className="basic-card-no-glow date" style={{'width': '100%', 'padding': '30px 0px', 'alignsItem': 'center', 'justifyContent': 'center', 'minWidth': '300px', 'maxWidth': '500px'}}>
                            <DatePicker initialDates={(this.state.old.time_each_day) ? this.state.old.time_each_day : []} controlEnable={true} initialMode={2} onSetDates={this.onDateSet} />
                            <div className="TimeInput">
                                <div>
                                    <h3>Start Time</h3>
                                    <TimeInput placeholder="start" onTimeChange={(val) => this.setState({
                                            ...this.state,
                                            'option': {
                                                ...this.state.option,
                                                'time_start': val
                                            }
                                        })} />
                                    <h3>End Time</h3>
                                    <TimeInput placeholder="end"  onTimeChange={(val) => this.setState({
                                            ...this.state,
                                            'option': {
                                                ...this.state.option,
                                                'time_end': val
                                            }
                                        })}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h1>EVENT DETAIL</h1>
                        <textarea type="text" placeholder="" value={this.state.new.about} onChange={() => {this.onKeyPressed();  this.resizeTextArea("about");}} ref="about" style={{'fontSize': '1em', 'width': 'calc(100% - 3px)', 'padding': '15px', 'boxSizing': 'border-box', 'marginBottom': '20px'}} />
                        <p className="l1"></p>
                        <div className="flex add" style={{'marginBottom': '20px'}}>
                            <AddList text="ADD CONTACT" mode={1} placeholder={["NAME", "CONTACT INFO", "NOTE"]} onUpdate={(val) => {
                                    this.setState({
                                        ...this.state,
                                        'option': {
                                            ...this.state.option,
                                            'contact': val
                                        }
                                    })
                                }} />
                            <AddList text="ADD FILE (URL)" mode={1} placeholder={["FILE NAME", "URL"]} onUpdate={(val) => {
                                this.setState({
                                    ...this.state,
                                    'option': {
                                        ...this.state.option,
                                        'file': val
                                    }
                                })
                                }} />
                            <AddList text="ADD URL" placeholder="URL" onUpdate={(val) => {
                                this.setState({
                                    ...this.state,
                                    'option': {
                                        ...this.state.option,
                                        'url': val
                                    }
                                })
                                }}/>
                        </div>
                        <PictureUpload text="Upload Pictures" isMultiple={true} isInit={!this.state.isLoading} srcs={this.state.old.picture_large.map((item) => replaceIncorrectLink(item))} showFilesNumber={true} persistentImg={true} onUpdate={(val, t) => {
                                this.setState({
                                    ...this.state,
                                    'new': {
                                        ...this.state.new,
                                        'picture_large': val
                                    },
                                    'option': {
                                        ...this.state.option,
                                        'picture_large_file': t
                                    }
                                })
                            }}/>
                    </div>
                    <p className="l1"></p>
                    <div>
                        <h1>TAG</h1>
                        <div className="flex flex-justify-center flex-wrap">
                            {
                                TAG_1.map((key, index) => {
                                    //Fuck you bitch
                                    if(key.length > 7) return (<Btn key={index} text={`${key}`} isInit={!this.state.isLoading} initialState={this.state.old.tags.indexOf(key) !== -1} classNameOn="Btn-active tag long" classNameOff="Btn tag long" callback={(isActive) => {this.onTagChange(1, isActive, index);}} />);
                                    return (<Btn key={index} text={`${key}`} classNameOn="Btn-active tag" isInit={!this.state.isLoading} initialState={this.state.old.tags.indexOf(key) !== -1} classNameOff="Btn tag" callback={(isActive) => {this.onTagChange(1, isActive, index);}} />);
                                })
                            }
                            <p className="l2 ltag"></p>
                            {
                                TAG_2.map((key, index) => {
                                    if(key.length > 7) return (<Btn key={index} text={`${key}`} isInit={!this.state.isLoading} initialState={this.state.old.tags.indexOf(key) !== -1} classNameOn="Btn-active tag long" classNameOff="Btn tag long" callback={(isActive) => {this.onTagChange(2, isActive, index);}} />);
                                    return (<Btn key={index} text={`${key}`} classNameOn="Btn-active tag" isInit={!this.state.isLoading} initialState={this.state.old.tags.indexOf(key) !== -1} classNameOff="Btn tag" callback={(isActive) => {this.onTagChange(2, isActive, index);}} />);
                                })
                            }
                        </div>
                    </div>
                    <p className="l1"></p>
                    <button onClick={this.toggleRecruitment} >{(this.state.enableRecruitment) ? 'Disable' : 'Enable'} Recruitment</button>
                    {
                        (this.state.enableRecruitment) ? (
                            <div className="add">
                                <h1>ADD FIRSTMEET</h1>
                                <div className="firstmeet">
                                    <input type="text" placeholder="LOCATION" style={{'margin': '5px 0px'}} value={this.state.option.recruitment.firstmeet.location} onChange={(event) => {this.onChangeText(event, "option.recruitment.firstmeet.location")}} />
                                    <input type="text" placeholder="NOTE" value={this.state.option.recruitment.firstmeet.note} onChange={(event) => {this.onChangeText(event, "option.recruitment.firstmeet.note")}} />
                                    <div className="button">
                                        <div className="DateClick">
                                            <button onClick={() => {
                                                    if(this.refs["firstmeetDate"].classList.contains("on")) this.refs["firstmeetDate"].classList.remove("on");
                                                    else this.refs["firstmeetDate"].classList.add("on");
                                                }} className="Btn" style={{'whiteSpace': 'nowrap', 'width': '100px'}}>{firstMeetDateStr}</button>
                                                <div className="DatePickerItem basic-card-no-glow" ref="firstmeetDate">
                                                    <DatePicker initialDates={firstMeetDateArray} controlEnable={false} initialMode={0} onSetDates={(date) => {
                                                        this.setState({
                                                            ...this.state,
                                                            'new': {
                                                                ...this.state.new,
                                                                'firstmeet': {
                                                                    ...this.state.firstmeet,
                                                                    'date': date[0]
                                                                }
                                                            },
                                                            'option': {
                                                                ...this.state.option,
                                                                'recruitment': {
                                                                    ...this.state.option.recruitment,
                                                                    'firstmeet': {
                                                                        ...this.state.option.recruitment.firstmeet,
                                                                        'date': date[0]
                                                                    }
                                                                }
                                                            }
                                                        });}}/>
                                                </div>
                                            </div>
                                            <Btn text="CLOSE WHEN FULL" classNameOn="Btn-active fill BtnCustom" classNameOff="Btn fill BtnCustom" callback={(isActive) => {
                                                    this.setState({
                                                        ...this.state,
                                                        'option': {
                                                            ...this.state.option,
                                                            'recruitment': {
                                                                ...this.state.option.recruitment,
                                                                'firstmeet': {
                                                                    ...this.state.option.recruitment.firstmeet,
                                                                    'closeWhenFull': isActive
                                                                }
                                                            }
                                                        }
                                                    })
                                                }} />
                                    </div>
                                </div>
                                <h1>RECRUITMENT DURATION</h1>
                                <div className="basic-card-no-glow" style={{'width': '340px', 'margin': 'auto', 'padding': '30px 0px', 'display': 'flex', 'alignsItem': 'center', 'justifyContent': 'center'}}>
                                    <DatePicker initialDates={[[new Date(this.state.old.notes[1].content[0]), new Date(this.state.old.notes[1].content[this.state.old.notes[1].content.length - 1])]]} controlEnable={false} initialMode={2} onSetDates={(dates) => {
                                            let date_start = dates[0];
                                            if(date_start.constructor === Array) date_start = new Date(date_start[0]);
                                            else date_start = new Date(date_start)
                                            let date_end = dates[dates.length - 1];
                                            if(date_end.constructor === Array) date_end = new Date(date_end[1]);
                                            else date_end = new Date(date_end);

                                            this.setState({
                                                ...this.state,
                                                'option': {
                                                    ...this.state.option,
                                                    'recruitment': {
                                                        ...this.state.option.recruitment,
                                                        'recruitmentDuration': [date_start, date_end]
                                                    }
                                                }
                                            })
                                        }} />
                                </div>
                                <h1 className="display-none">PARTICIPANTS FILTER</h1>
                                <div className="flex display-none" style={{'width': '100%', 'alignItems': 'center'}}>
                                    <Btn text="ONLY CHULA" classNameOn="Btn-active fill tg flex-1" classNameOff="Btn fill tg" style={{'marginBottom': '0px', 'maxWidth': '120px'}} callback={(isActive) => {
                                            this.onChangeText({target: {value: isActive}}, "option.recruitment.filter.onlyChula")
                                        }} />
                                    <select style={{'width': '50%', 'height': '35px', 'marginRight': '10px'}}>
                                        <option value="ALL">ALL</option>
                                        {
                                            fullId.map((id, index) => {
                                                return <option value={findInfoById(id).FullName} key={index}>{findInfoById(id).FullName}</option>
                                            })
                                        }
                                    </select>
                                    <select style={{'width': '20%', 'height': '35px'}}>
                                        {
                                            ["ALL", "1", "2", "3", "4", "5", "6", "7", "OTHER"].map((item, index) => {
                                                return <option value={item} key={index}>{item}</option>
                                            })
                                        }
                                    </select>
                                </div>
                            </div>
                        ) : (null)
                    }
                    <p className="l1" />
                    <div className="check">
                        <h1>REQUIRED INFORMATION</h1>
                        <div className="flex">
                        <div className="w30">
                            <CustomRadio state={state} text="NAME and SURNAME" onClick={(this.onClickField)} />
                            <CustomRadio state={state} text="NICKNAME" onClick={(this.onClickField)} />
                            <CustomRadio state={state} text="STUDENT ID" onClick={(this.onClickField)} />
                            <CustomRadio state={state} text="FACULTY" onClick={(this.onClickField)} />
                            <CustomRadio state={state} text="YEAR" onClick={(this.onClickField)} />
                        </div>
                        <div className="w30">
                            <CustomRadio state={state} text="BIRTHDAY" onClick={(this.onClickField)} />
                            <CustomRadio state={state} text="FACEBOOK" onClick={(this.onClickField)} />
                            <CustomRadio state={state} text="LINE ID" onClick={(this.onClickField)} />
                            <CustomRadio state={state} text="EMAIL" onClick={(this.onClickField)} />
                            <CustomRadio state={state} text="MOBILE NUMBER" onClick={(this.onClickField)} />
                        </div>
                        <div className="w30">
                            <CustomRadio state={state} text="T-SHIRT SIZE" onClick={(this.onClickField)} />
                            <CustomRadio state={state} text="MEDICAL PROBLEM" onClick={(this.onClickField)} />
                            <CustomRadio state={state} text="FOOD ALLERGIES" onClick={(this.onClickField)} />
                        </div>
                        </div>
                    </div>
                    <p className="l2"></p>
                    <div>
                        <Btn text="ENABLE QUESTION" classNameOn="bl Btn-active" classNameOff="bl Btn" callback={(isActive) => {
                            this.setState({
                                ...this.state,
                                enableForm: isActive
                            })
                        }} />
                        Click to create your form after submit.
                    </div>
                    <p className="l1"></p>
                    <div className="admin">
                        <h1>ADD EVENT ADMIN</h1>
                        <AddAdmin user={this.props.user} onSelected={(d) => {}}/>
                    </div>
                    <div>
                        <button className="bt blue">PUBLIC</button>
                        <button className="bt" onClick={this.save.bind(this)}>SAVE</button>
                        <button className="bt" onClick={this.cancel.bind(this)}>CANCEL</button>
                    </div>
                </article>
                <div className="background-overlay" onClick={this.props.onToggle} />
            </div>
        )
    }
}

// export default autoBind(EditEvent);
