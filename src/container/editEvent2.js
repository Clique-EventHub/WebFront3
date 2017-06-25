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

        // title,about,video,channel,location,date_start,expire,date_end,picture,picture_large, year_require,faculty_require,tags,forms

        // about, video, location, date_start, date_end, picture, picture_large, year_require, faculty_require, tags, agreement, contact_information,
        // joinable_start_time, joinable_end_time, joinable_amount, time_start, time_end, optional_field, require_field, show, outsider_accessible

        let _this = this;

        axios.get('http://128.199.208.0:1111/event?id=5946245c4b908f001403aba6').then((data) => {
            console.log("get!!!");
            console.log(JSON.stringify(data.data.title))
            _this.state = {
                'name': data.data.title,
                'loc': data.data.location,
                'date': data.data.date_start,
                'detail': data.data.about,
                'new_name': data.data.title,
                'new_loc': data.data.location,
                'new_date': data.data.date_start,
                'new_detail': data.data.about,
            }
        }, (error) => {
            console.log("get event error");
        });

        this.state = {

        }

        this.onKeyPressed = this.onKeyPressed.bind(this);
    }

    onKeyPressed() {
        const newState = {
            ...this.state,
            new_name: this.refs.name.value,
            new_loc: this.refs.loc.value,
            new_date: this.refs.date.value,
            new_detail: this.refs.detail.vaule,
        };
        this.setState(newState);
    }

    save() {
        const newState = {
            ...this.state,
            name: this.refs.id.value,
            loc: this.refs.birth.value,
            data: this.refs.nickname.value,
            detail: this.refs.line.value,
        };
        this.setState(newState);

        let config = {
            'headers': {
                'Authorization': ('JWT ' + getCookie('fb_sever_token'))
            }
        }

        let responseBody = {
            title: this.state.name,
            about: this.state.detail,
            location: this.state.loc,
            date_start: this.state.date,
        }

        // axios.get('http://128.199.208.0:1111/event?id=5946245c4b908f001403aba6').then((data) => {
        //     console.log("get!!!");
        //     responseBody = data;
        // }, (error) => {
        //     console.log("get event error");
        // });

        axios.put('http://128.199.208.0:1111/event?id=5946245c4b908f001403aba6', responseBody, config).then((response) => {
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
            new_id: this.state.id,
            new_birth: this.state.birth,
            new_nickname: this.state.nickname,
            new_line: this.state.line,
            new_email: this.state.email,
            new_mobile: this.state.mobile,
            new_size: this.state.size,
            new_med: this.state.med,
            new_food: this.state.food,
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
                        <h1>EVENT NAME</h1> <input ref="name" type="text" placeholder="" value={this.state.new_name} onChange={this.onKeyPressed}/>
                        <h1>EVENT LOCATION</h1> <input ref="loc" type="text" placeholder="" value={this.state.new_loc} onChange={this.onKeyPressed}/>
                        <h1>DATE & TIME</h1> <input ref="date" type="text" placeholder="" value={this.state.new_date} onChange={this.onKeyPressed}/>
                    </div>
                    <div>
                        <h1>ADD A POSTER</h1> <button className="fill">UPLOAD</button>
                    </div>
                    </div>
                    <p className="l1"></p>
                    <div>
                        <h1>EVENT DETAIL</h1> <textarea className="detail" ref="detail" type="text" placeholder="" value={this.state.new_detail} onChange={this.onKeyPressed}/>
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
                        <button className="bt" onClick={this.cancel.bind(this)}>CANCLE</button>
                    </div>
                </article>
                <div className="background-overlay"/>
            </div>
        )
    }
}

export default autoBind(EditEvent);
