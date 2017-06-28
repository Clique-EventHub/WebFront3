import React, { Component } from 'react';
import autoBind from '../hoc/autoBind';
import EventItem from '../container/eventItem';
import './css/editEvent2.css';
import axios from 'axios';
import { getCookie } from '../actions/common';
import CustomRadio from '../components/CustomRadio';
import DatePicker from '../components/datePicker';

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

const defaultState = {
    'eventName': 'Event Name'
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

class EditEvent extends Component {
    constructor(props) {
        super(props);

        let _this = this;

        this.state = {
            'event_id': "594bf476e374d100140f04ec",
            'isLoading': true,
        }

        this.onKeyPressed = this.onKeyPressed.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({updated: nextProps.updated});
    }

    componentWillMount() {
        let _this = this;

        axios.get('http://128.199.208.0:1111/event?id=' + _this.state.event_id).then((data) => {
            console.log("get!!!");
            console.log(JSON.stringify(data.data.title))
            _this.setState({
                ...this.state,
                'title': data.data.title,
                'about': data.data.about,
                'channel': data.data.channel,
                'video': data.data.video,
                'location': data.data.location,
                'date_start': data.data.date_start,
                'date_end': data.data.date_end,
                'picture': data.data.picture,
                'picture_large': data.data.picture_large,
                'year_require': data.data.year_require,
                'faculty_require': data.data.faculty_require,
                'tags': data.data.tags,
                'forms': data.data.forms,

                'new_title': data.data.title,
                'new_about': data.data.about,
                'new_channel': data.data.channel,
                'new_video': data.data.video,
                'new_location': data.data.location,
                'new_date_start': data.data.date_start,
                'new_date_end': data.data.date_end,
                'new_picture': data.data.picture,
                'new_picture_large': data.data.picture_large,
                'new_year_require': data.data.year_require,
                'new_faculty_require': data.data.faculty_require,
                'new_tags': data.data.tags,
                'new_forms': data.data.forms,
            })
        }, (error) => {
            console.log("get event error");
        });
    }

    onKeyPressed() {
        const newState = {
            ...this.state,
            'new_title': this.refs.title.value,
            'new_about': this.refs.about.value,
            'new_channel': this.refs.channel.value,
            'new_video': this.refs.video.value,
            'new_location': this.refs.location.value,
            'new_date_start': this.refs.date_start.value,
            'new_date_end': this.refs.date_end.value,
            'new_picture': this.refs.picture.value,
            'new_picture_large': this.refs.picture_large.value,
            'new_year_require': this.refs.year_require.value,
            'new_faculty_require': this.refs.faculty_require.value,
            'new_tags': this.refs.tags.value,
            'new_forms': this.refs.forms.value,
        };
        this.setState(newState);
    }

    save() {
        const newState = {
            ...this.state,
            'title': this.refs.title.value,
            'about': this.refs.about.value,
            'channel': this.refs.channel.value,
            'video': this.refs.video.value,
            'location': this.refs.location.value,
            'date_start': this.refs.date_start.value,
            'date_end': this.refs.date_end.value,
            'picture': this.refs.picture.value,
            'picture_large': this.refs.picture_large.value,
            'year_require': this.refs.year_require.value,
            'faculty_require': this.refs.faculty_require.value,
            'tags': this.refs.tags.value,
            'forms': this.refs.forms.value,
        };
        this.setState(newState);

        let config = {
            'headers': {
                'Authorization': ('JWT ' + getCookie('fb_sever_token'))
            }
        }

        let responseBody = {
            'title': this.refs.title.value,
            'about': this.refs.about.value,
            'channel': this.refs.channel.value,
            'video': this.refs.video.value,
            'location': this.refs.location.value,
            'date_start': this.refs.date_start.value,
            'date_end': this.refs.date_end.value,
            'picture': this.refs.picture.value,
            'picture_large': this.refs.picture_large.value,
            'year_require': this.refs.year_require.value,
            'faculty_require': this.refs.faculty_require.value,
            'tags': this.refs.tags.value,
            'forms': this.refs.forms.value,
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
            'new_title': this.state.title,
            'new_about': this.state.about,
            'new_channel': this.state.channel,
            'new_video': this.state.video,
            'new_location': this.state.location,
            'new_date_start': this.state.date_start,
            'new_date_end': this.state.date_end,
            'new_picture': this.state.picture,
            'new_picture_large': this.state.picture_large,
            'new_year_require': this.state.year_require,
            'new_faculty_require': this.state.faculty_require,
            'new_tags': this.state.tags,
            'new_forms': this.state.forms,
        };
        this.setState(newState);
        this.props.toggle_pop_item();
    }

    render () {
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
                            <EventItem onToggle={() => {}} onSetItem={() => {}} noGlow="true" overrideState={defaultState} />
                        </div>
                    </div>
                    <p className="l1"></p>
                    <div className="flex">
                    <div className="w55">
                        <h1>EVENT NAME</h1> <input ref="title" type="text" placeholder="" value={this.state.new_title} onChange={this.onKeyPressed}/>
                        <h1>EVENT LOCATION</h1> <input ref="location" type="text" placeholder="" value={this.state.new_location} onChange={this.onKeyPressed}/>
                        <h1>DATE & TIME</h1> <input ref="date_start" type="text" placeholder="" value={this.state.new_date_start} onChange={this.onKeyPressed}/>
                    </div>
                    <div>
                        <h1>ADD A POSTER</h1> <button className="fill">UPLOAD</button>
                    </div>
                    </div>
                    <p className="l1"></p>
                    <div>
                        <h1>EVENT DETAIL</h1> <textarea className="detail" ref="detail" type="text" placeholder="" value={this.state.new_about} onChange={this.onKeyPressed}/>
                        <div className="flex add">
                            <div className="flex-1"><h1>ADD URL</h1> <button className="fill">URL</button></div>
                            <div className="flex-1"><h1>ADD FILE</h1> <button className="fill">FILE</button></div>
                            <div className="flex-1"><h1>ADD CONTACT</h1> <button className="fill">CONTACT</button></div>
                        </div>
                    </div>
                    <p className="l1"></p>
                    <div>
                        <h1>TAG</h1>
                        {
                            TAG_1.map((key, index) => {
                                if(key.length > 7) return (<Btn key={index} text={`${key}`} classNameOn="Btn-active tag long" classNameOff="Btn tag long"/>);
                                return (<Btn key={index} text={`${key}`} classNameOn="Btn-active tag" classNameOff="Btn tag"/>);
                            })
                        }
                        <p className="l2 ltag"></p>
                            {
                                TAG_2.map((key, index) => {
                                    if(key.length > 7) return (<Btn key={index} text={`${key}`} classNameOn="Btn-active tag long" classNameOff="Btn tag long"/>);
                                    return (<Btn key={index} text={`${key}`} classNameOn="Btn-active tag" classNameOff="Btn tag"/>);
                                })
                            }
                    </div>
                    <p className="l1"></p>
                    <div>
                        <button className="bl">JOIN UP?</button> Click to start your recuitment.
                    </div>
                    <p className="l1"></p>
                    <div className="add">
                        <h1>ADD FIRSTMEET</h1>
                        <div className="flex">
                            <input ref="loc" type="text" placeholder="LOCATION" value={this.state.loc} onChange={this.onKeyPressed}/>
                            <input ref="loc" type="text" placeholder="DATE" value={this.state.loc} onChange={this.onKeyPressed}/>
                        </div>
                        <textarea ref="loc" type="text" placeholder="ADD DESCRIPTION" value={this.state.loc} onChange={this.onKeyPressed}/>
                        <h1>RECRUITMENT DURATION</h1>
                        <div className="basic-card-no-glow" style={{'width': '340px', 'margin': 'auto'}}>
                            <DatePicker />
                        </div>
                        <h1>ADD FIRSTMEET</h1>
                        <div className="flex">
                            <input ref="loc" type="text" placeholder="" value={this.state.loc} onChange={this.onKeyPressed}/>
                            <Btn text="CLOSE WHEN FULL" classNameOn="Btn-active fill" classNameOff="Btn fill" />
                        </div>

                        <h1>PARTICIPANTS FILTER</h1>
                        <Btn text="ONLY CHULA" classNameOn="Btn-active fill tg" classNameOff="Btn fill tg" />
                        <input className="list" list="fac" placeholder="FACULTY"/>
                        <datalist id="fac">
                            <option value="ALL"/>
                            <option value="ENGINEERING"/>
                            <option value="ART"/>
                            <option value="SCIENCE"/>
                        </datalist>
                        <input className="list" list="year" placeholder="YEAR"/>
                        <datalist id="year">
                            <option value="ALL"/>
                            <option value="1"/>
                            <option value="2"/>
                            <option value="3"/>
                            <option value="4"/>
                            <option value="5"/>
                            <option value="6"/>
                            <option value="OTHER"/>
                        </datalist>
                    </div>
                    <p className="l2"></p>
                    <div className="check">
                        <h1>REQUIRED INFORMATION</h1>
                        <div className="flex">
                        <div className="w30">
                            <CustomRadio state={state} text="NAME and SURNAME" />
                            <CustomRadio state={state} text="NICKNAME" />
                            <CustomRadio state={state} text="STUDENT ID" />
                            <CustomRadio state={state} text="FACULTY" />
                            <CustomRadio state={state} text="YEAR" />
                        </div>
                        <div className="w30">
                            <CustomRadio state={state} text="BIRTHDAY" />
                            <CustomRadio state={state} text="FACEBOOK" />
                            <CustomRadio state={state} text="LINE ID" />
                            <CustomRadio state={state} text="EMAIL" />
                            <CustomRadio state={state} text="MOBILE NUMBER" />
                        </div>
                        <div className="w30">
                            <CustomRadio state={state} text="T-SHIRT SIZE" />
                            <CustomRadio state={state} text="MEDICAL PROBLEM" />
                            <CustomRadio state={state} text="FOOD ALLERGIES" />
                        </div>
                        </div>
                    </div>
                    <p className="l2"></p>
                    <div>
                        <button className="bl">ADD QUESTION</button> Click to create your form.
                    </div>
                    <p className="l1"></p>
                    <div>
                        <div className="flex"> <h1>TELL MORE</h1> <p>This text will show when they finish registeration</p> </div>
                        <textarea className="detail" ref="" type="text" value=""/>
                    </div>
                    <p className="l1"></p>
                    <div className="admin">
                        <h1>ADD EVENT ADMIN</h1>
                        <input ref="" type="text" value=""/>
                        <input ref="" type="text" value=""/>
                        <div className="flex"> <input ref="" type="text" placeholder="FACEBOOK / STUDENT ID" value=""/><button className="fill">+</button> </div>
                    </div>
                    <div>
                        <button className="bt blue">PUBLIC</button>
                        <button className="bt" onClick={this.save.bind(this)}>SAVE</button>
                        <button className="bt" onClick={this.cancel.bind(this)}>CANCEL</button>
                    </div>
                </article>
                <div className="background-overlay"/>
            </div>
        )
    }
}

export default autoBind(EditEvent);
