import React, { Component } from 'react';
import autoBind from '../hoc/autoBind';
import EventItem from '../container/eventItem';
import './css/editEvent2.css';
import axios from 'axios';
import { getCookie } from '../actions/common';
import CustomRadio from '../components/CustomRadio';
import DatePicker from '../components/datePicker';
import TimeInput from '../components/TimeInput';
import { fullId, findInfoById } from '../actions/facultyMap';

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

const defaultDate = {
    'dates': [],
    'time': {
        'start': '',
        'end': ''
    },
    'enableRecruitment': false
}

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

const defaultState = {
    'event_id': "594bf476e374d100140f04ec",
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
        'picture_large': '',
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
    }
}

class AddList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            'children': (this.props.children && this.props.children.constructor === Array) ? this.props.children : [],
            'mode': this.props.mode ? this.props.mode : 0
        }
        this.onClickAdd = this.onClickAdd.bind(this);
        this.onEdit = this.onEdit.bind(this);
        this.onRemove = this.onRemove.bind(this);
    }

    onClickAdd() {
        switch (this.state.mode) {
            case 0:
                this.setState({
                    ...this.state,
                    'children': this.state.children.concat([""])
                })
                break;
            default:
                this.setState({
                    ...this.state,
                    'children': this.state.children.concat([{
                        "title": "",
                        "content": [],
                        "note": ""
                    }])
                })
        }
    }

    onEdit(index) {
        let new_children = [...this.state.children];

        switch (this.state.mode) {
            case 0:
                new_children[index] = this.refs[`input-${index}`].value;
                break;
            default:
                new_children[index] = {
                    "title": this.refs[`child-${index}`].children[1].value,
                    "content": this.refs[`child-${index}`].children[2].value,
                    "note": (this.props.placeholder && this.props.placeholder.constructor === Array && this.props.placeholder.length === 3) ? this.refs[`child-${index}`].children[3].value : null
                }
        }

        this.setState({
            ...this.state,
            'children': new_children
        })
    }

    onRemove(index) {
        this.setState({
            ...this.state,
            'children': this.state.children.slice(0, index).concat(this.state.children.slice(index+1, this.state.children.length))
        })
    }

    componentDidUpdate() {
        if(typeof(this.props.onUpdate) === "function") {
            this.props.onUpdate(this.state.children);
        }
    }

    render() {
        return (
            <div className={`AddList ${this.props.className ? this.props.className : ''}`}>
                <ul data-role="top-list">
                    {
                        this.state.children.map((info, index) => {
                            return (this.state.mode === 0) ? (
                                <li key={index}>
                                    <input value={info} onChange={() => {this.onEdit(index);}} ref={`input-${index}`} placeholder={this.props.placeholder ? this.props.placeholder : ''} />
                                    <button className="invisible square-round" onClick={() => {this.onRemove(index)}}>
                                        <img src="../../resource/images/X.svg" />
                                    </button>
                                </li>
                            ) : (
                                <li key={index} ref={`child-${index}`} className="ChildBox">
                                    <button className="invisible square-round right" onClick={() => {this.onRemove(index)}}>
                                        <img src="../../resource/images/X.svg" />
                                    </button>
                                    <input value={info.title} onChange={() => {this.onEdit(index);}} placeholder={(this.props.placeholder && this.props.placeholder.constructor === Array) ? this.props.placeholder[0] : "Title"} />
                                    <input value={info.content} onChange={() => {this.onEdit(index);}} placeholder={(this.props.placeholder && this.props.placeholder.constructor === Array) ? this.props.placeholder[1] : "Content"} />
                                    {
                                        (this.props.placeholder && this.props.placeholder.constructor === Array && this.props.placeholder.length === 3) ? (
                                            <input value={info.note} onChange={() => {this.onEdit(index);}} placeholder={(this.props.placeholder && this.props.placeholder.constructor === Array) ? this.props.placeholder[2] : "Note"} />
                                        ) : (null)
                                    }
                                </li>
                            )
                        })
                    }
                </ul>
                <div data-role="bottom-button">
                    <button onClick={this.onClickAdd}>{this.props.text ? this.props.text : "Add"}</button>
                </div>
            </div>
        );
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
    }

    componentWillReceiveProps(nextProps) {
        this.setState({updated: nextProps.updated});
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
        let _this = this;

        axios.get('http://128.199.208.0:1111/event?id=' + _this.state.event_id).then((data) => {
            console.log("get!!!");
            console.log(JSON.stringify(data.data.title))
            _this.setState({
                ...this.state,
                'old': {
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
                },
                'new': {
                    'title': data.data.title,
                    'about': data.data.about,
                    'channel': data.data.channel,
                    'video': data.data.video,
                    'location': data.data.location,
                    'date_time': defaultDate,
                    'picture': data.data.picture,
                    'picture_large': data.data.picture_large,
                    'year_require': data.data.year_require,
                    'faculty_require': data.data.faculty_require,
                    'tags': data.data.tags,
                    'forms': data.data.forms,
                }
            })
            this.resizeTextArea("about");
        }, (error) => {
            console.log("get event error");
        });
    }

    componentDidUpdate() {
        console.log(this.state);
    }

    onKeyPressed() {
        const newState = {
            ...this.state,
            'new': {
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
                'forms': (this.refs.forms) ? this.refs.forms.value : '',
            }
        };
        this.setState(newState);
    }

    save() {

        let config = {
            'headers': {
                'Authorization': ('JWT ' + getCookie('fb_sever_token'))
            }
        }

        let responseBody = {
            ...this.state.new
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
                            <EventItem onToggle={() => {}} onSetItem={() => {}} noGlow="true" overrideState={{
                                    'title': this.state.new.title,
                                    'location': this.state.new.location,
                                    'date_time': this.state.new.date_time.dates,
                                    'about': this.state.new.about,
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
                            <label className="fileContainer">
                                <div>Upload</div>
                                <input type="file" ref="poster" onChange={this.onSelectedPoster} id="poster" name="poster" className="fileInput" accept="image/*" />
                            </label>
                            <div data-alt="preview-image" ref="preview-image" />
                        </div>
                    </div>
                    <div>
                        <h1>DATE & TIME</h1>
                        <div className="basic-card-no-glow date" style={{'width': '500px', 'display': 'flex', 'padding': '30px 0px', 'alignsItem': 'center', 'justifyContent': 'center'}}>
                            <DatePicker controlEnable={true} initialMode={2} onSetDates={this.onDateSet} />
                            <div className="TimeInput">
                                <div>
                                    <h3>Start Time</h3>
                                    <TimeInput placeholder="start" onTimeChange={(val) => console.log(val)} />
                                    <h3>End Time</h3>
                                    <TimeInput placeholder="end"  onTimeChange={(val) => console.log(val)}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h1>EVENT DETAIL</h1>
                        <textarea type="text" placeholder="" value={this.state.new.about} onChange={() => {this.onKeyPressed();  this.resizeTextArea("about");}} ref="about" style={{'fontSize': '1em', 'width': 'calc(100% - 3px)', 'padding': '15px', 'boxSizing': 'border-box', 'marginBottom': '20px'}} />
                        <p className="l1"></p>
                        <div className="flex add" style={{'marginBottom': '20px'}}>
                            <AddList text="ADD CONTACT" mode={1} placeholder={["NAME", "CONTACT INFO", "NOTE"]} />
                            <AddList text="ADD FILE (URL)" mode={1} placeholder={["FILE NAME", "URL"]} />
                            <AddList text="ADD URL" placeholder="URL" />
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
                    <button onClick={this.toggleRecruitment} >{(this.state.enableRecruitment) ? 'Disable' : 'Enable'} Recruitment</button>
                    {
                        (this.state.enableRecruitment) ? (
                            <div className="add">
                                <h1>ADD FIRSTMEET</h1>
                                <div className="flex">
                                    <input ref="loc" type="text" placeholder="LOCATION" />
                                    <input ref="loc" type="text" placeholder="DATE" />
                                </div>
                                <textarea ref="loc" type="text" placeholder="ADD DESCRIPTION" />
                                <h1>RECRUITMENT DURATION</h1>
                                <div className="basic-card-no-glow" style={{'width': '340px', 'margin': 'auto', 'padding': '30px 0px', 'display': 'flex', 'alignsItem': 'center', 'justifyContent': 'center'}}>
                                    <DatePicker controlEnable={false} initialMode={2} />
                                </div>
                                <h1>ADD FIRSTMEET</h1>
                                <div className="flex">
                                    <input ref="loc" type="text" placeholder="" value={this.state.loc} onChange={this.onKeyPressed}/>
                                    <Btn text="CLOSE WHEN FULL" classNameOn="Btn-active fill" classNameOff="Btn fill" />
                                </div>

                                <h1>PARTICIPANTS FILTER</h1>
                                <Btn text="ONLY CHULA" classNameOn="Btn-active fill tg" classNameOff="Btn fill tg" />
                                <select>
                                    <option value="ALL">ALL</option>
                                    {
                                        fullId.map((id, index) => {
                                            return <option value={findInfoById(id).FullName} key={index}>{findInfoById(id).FullName}</option>
                                        })
                                    }
                                </select>
                                <select>
                                    {
                                        ["ALL", "1", "2", "3", "4", "5", "6", "OTHER"].map((item, index) => {
                                            return <option value={item} key={index}>{item}</option>
                                        })
                                    }
                                </select>
                            </div>
                        ) : (null)
                    }
                    <p className="l1" />
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
                    <div className="admin">
                        <h1>ADD EVENT ADMIN</h1>
                        <AddList text="ADD ADMIN" placeholder="STUDENT ID/FACEBOOK ID" />
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
