import React, { Component } from 'react';
import './css/eventDetail2.css'
import * as facultyMap from '../actions/facultyMap';
import axios from 'axios';
import { hostname, urlName } from '../actions/index';
import { getCookie, getChannel } from '../actions/common';
import ReactLoading from 'react-loading';
import { Link } from 'react-router';
import Image from '../components/Image';
import autoBind from '../hoc/autoBind';
import _ from 'lodash';

//https://codepen.io/bh/pen/JBlCc
let useCls = " toggle-vis";
const codeList = facultyMap.getCodeList();
let index = 0;

const isImplement = false;

const defaultState = {
    'title': null,
    'about': [],
    'video': null,
    'channel': null,
    'location': null,
    'date_start': null,
    'expire': null,
    'date_end': null,
    'picture': null,
    'picture_large': [],
    'year_require': null,
    'faculty_require': null,
    'tags': null,
    'forms': null,
    'isLoading': true,
    'error': null,
    'require_field': [],
    'optional_field': []
}

function replaceIncorrectLink(str) {
    if(typeof(str) === "string") {
        if(str.indexOf("139.59.97.65/") === 0) str = str.replace("139.59.97.65/", hostname);
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
            <div style={{
                    ...this.props.overrideOutermostStyle,
                    'position': 'relative'
                }}>
                <div
                    className={`${this.props.BtnClass ? this.props.BtnClass : ''}`}
                    style={{...this.props.BtnStyle}}
                    onClick={this.toggleState} />
                {PopUp}
            </div>
        );
    }
}

class eventDetailFix extends Component {

    constructor(props) {
        super(props);
        this.onBtnClick = this.onBtnClick.bind(this);
        this.onResetPopup = this.onResetPopup.bind(this);
        this.onGetInfo = this.onGetInfo.bind(this);
        this.state = defaultState;
        console.log("Hello")
    }

    onExit() {
        this.props.onToggle();
    }

    componentWillMount() {
        this.onGetInfo();
    }

    componentDidMount() {
        this.onResetPopup();
    }

    componentDidUpdate() {
        if(!this.state.isLoading) {
            let allName = document.getElementsByClassName("event-name");
            Object.keys(allName).map((key) => {
                window.fitText(allName[key].children[0], 1, {
                    'maxFontSize': '32px'
                });
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.eventId !== this.props.eventId) {
            this.setState((prevState, props) => {
                this.onGetInfo(nextProps.eventId);
                return defaultState;
            });
        }
    }

    onGetInfo(overrideId) {
        this.setState({
            ...this.state,
            'isLoading': true
        });

        const id = overrideId || this.props.eventId;

        axios.get(`${hostname}event?id=${id}`, { headers: { 'crossDomain': true }}).then((data) => {
            this.setState((prevState) => {
                return ({
                    ...defaultState,
                    ...data.data,
                    isLoading: false
                })
            }, () => {
                if(_.get(this.props, 'user.events.general.interest', []).indexOf(id) !== -1) {
                    if(this.interestBtn.className.indexOf(" active") === -1) this.interestBtn.className += " active";
                } else {
                    if(this.interestBtn.className.indexOf(" active") !== -1) this.interestBtn.className.replace(" active", "");
                }

                if(_.get(this.props, 'user.events.general.join', []).indexOf(id) !== -1) {
                    if(this.joinBtn.className.indexOf(" active") === -1) this.joinBtn.className += " active";
                } else {
                    if(this.joinBtn.className.indexOf(" active") !== -1) this.joinBtn.className.replace(" active", "");
                }

            });
            this.onResetPopup();
            return data.data;
        }).then((event) => {
            getChannel(event.channel, false).then((res) => {
                this.setState({
                    ...this.state,
                    'channel': res
                });
                this.onResetPopup();
            })
        }).catch((error) => {
            console.log(error.response);
            this.setState({
                ...this.state,
                'error': 'Oh! Ow! Something went wrong. Please check your internet connection',
                'isLoading': false
            });
        })
    }

    onResetPopup() {
        Object.keys(this.refs).forEach((key) => {
            if(!this.refs[key].className.includes(useCls)) this.refs[key].className += useCls;
        })
    }

    onBtnClick(refName) {
        if(this.refs[refName].className.includes(useCls)) {
            this.onResetPopup();
            this.refs[refName].className = this.refs[refName].className.replace(useCls, "");
        } else {
            this.refs[refName].className += useCls;
        }
    }

    onClickInterest() {
        const config = {
            'headers': {
                'Authorization': ('JWT ' + getCookie("fb_sever_token"))
            }
        }
        axios.put(`${hostname}user/interest?id=${this.props.eventId}`, {}, config).then((data) => {
            console.log(data);
        }).catch((e) => {
            console.log(e);
        })
    }

    onClickJoin() {
        const config = {
            'headers': {
                'Authorization': ('JWT ' + getCookie("fb_sever_token"))
            }
        }

        new Promise((gg) => {
            let fields = {
                'require_field': {},
                'optional_field': {}
            };

            const metaKeys = [
                "email",
                "facebookId",
                "firstName",
                "id",
                "lastName",
                "picture",
                "picture_200px"
            ]

            this.state.require_field.forEach((key) => {
                if(metaKeys.indexOf(key) !== -1) {
                    fields["require_field"][key] = _.get(this.props.user, `meta[${key}]`, '')
                } else {
                    fields["require_field"][key] = _.get(this.props.user, `info[${key}]`, '')
                }
            })

            this.state.optional_field.forEach((key) => {
                if(metaKeys.indexOf(key) !== -1) {
                    fields["require_field"][key] = _.get(this.props.user, `meta[${key}]`, '')
                } else {
                    fields["require_field"][key] = _.get(this.props.user, `info[${key}]`, '')
                }
            })

            axios.put(`${hostname}user/join?id=${this.props.eventId}`, fields, config).then((data) => {
                gg(data);
            }).catch((e) => {
                gg(e);
            })

        }).then((whatever) => {
            console.log(whatever);
            // this.props.context.router.push(`/form?id=${'596c561c15cd7b3235449c42'}`);
        })

    }

    componentDidUpdate() {
        console.log(this.state);
    }

    render() {

        let eventName = (
            <div className="event-name">
                <h2 className="truncate">{this.state.title}</h2>
                <Link className="flex" to={`/channel/${(this.state.channel) ? this.state.channel._id : ''}`}>
                    <Image src={replaceIncorrectLink(this.state.channel_picture)}  imgOption={{'data-icon': 'channel-icon', 'alt': 'channel-icon'}} rejectOption={{'data-icon': 'channel-icon'}} />
                    <span> {this.state.channel_name}</span>
                </Link>
            </div>
        );

        const isAdmin = (this.props.isAdmin) ? this.props.isAdmin : false;
        let adminComponent = (
            <div>
                <div className="flex">
                    <div className="btn-top">EDIT</div>
                    <div className="btn-top">PARTICIPANTS LIST</div>
                </div>
                <p className="hr" />
            </div>
        )

        let content = (
            <div>
                <div className="top-moving">
                    <div className="toggle">
                        {eventName}
                    </div>
                    <div className="event-poster-fix">
                        <Image src={replaceIncorrectLink(this.state.picture)} imgOption={{'alt': 'main-poster'}} rejectClass="flex-1 min-height-400" />
                        <div className="tags-container">
                            <div data-icon="tag" />
                            <div data-icon="tag" />
                            <div data-icon="tag" />
                        </div>
                    </div>
                    <div className="column">
                        <div className="toggle-not">
                            {eventName}
                        </div>
                        <div className="event-info">
                            <div className="share-interest-join" aria-hidden="true">
                                <div className="float-left" onClick={() => {this.onBtnClick("share-popup")}}><i className="fa fa-share-square-o" aria-hidden="true"></i> SHARE</div>
                                <div className="to-right" >
                                    <button alt="btn-interest" ref={(btn) => this.interestBtn = btn} onClick={this.onClickInterest.bind(this)}>INTEREST</button>
                                    <button alt="btn-join" ref={(btn) => this.joinBtn = btn} onClick={() => {
                                            if(this.joinBtn.className.indexOf(" active") === -1)
                                                this.onBtnClick("warning-popup")
                                        }}>JOIN</button>
                                </div>
                                <div className={`warning-pop-up basic-card-no-glow ${useCls}`} data-role="share-popup" ref="share-popup">
                                    <div className="btn-c btn-facebook" />
                                    <div className="btn-c btn-twitter" />
                                    <PopupButton overrideOutermostStyle={{
                                            'maxWidth': 'calc(2.2em + 10px)'
                                        }} BtnClass='btn-c btn-share' obj={
                                            <input value={`${urlName}?eid=${this.props.eventId}`} className="mar-20 bottom-outline-1 border-focus-blue border-transition" style={{'fontSize': '1.2em', 'maxWidth': '100px'}} />
                                        } OuterClass={'basic-card-no-glow'} />
                                    <div className="btn-invite shade-blue" onClick={() => {
                                            if(isImplement) this.onBtnClick("invite-popup")
                                        }}>INVITE</div>
                                </div>
                                <div className={`warning-pop-up basic-card-no-glow ${useCls}`} data-role="invite-popup" ref="invite-popup">
                                    <button className="invisible square-round" role="event-exit" onClick={this.onResetPopup}>
                                        <img src="../../resource/images/X.svg" />
                                    </button>
                                    <div className="btn-invite shade-green">INVITE FRIENDS</div>
                                    <div className="search-zone">
                                        <input type="text" placeholder="Search friends name" />
                                        <div className="result-list">
                                        {
                                            [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20].map((item) => {
                                                let info = facultyMap.findInfoById(codeList[item-1])
                                                //{ ClassNameKeyWord: 'engineer', FullName: 'Engineering'}
                                                return (
                                                    <div className="result" key={item}>
                                                        <Image src="" imgOption={{'alt': 'profile'}} rejectClass="profile" />
                                                        <div className="info">
                                                            <span>Friend Name</span>
                                                            <div>
                                                                <div className={`bg-${info.ClassNameKeyWord}`} />
                                                                <span>{info.FullName}</span>
                                                            </div>
                                                        </div>
                                                    </div>);
                                            })
                                        }
                                        </div>
                                    </div>
                                </div>
                                <div className={`warning-pop-up basic-card-no-glow ${useCls}`} data-role="warn-popup" ref="warning-popup">
                                    <div className="Warning">
                                        Are you sure that you will register to this event? Your information will sent to event creator.
                                    </div>
                                    <div className="field-show-container">
                                        <div className="field-show">
                                            <div className="item"><span className="icon fa fa-user" />Name - Surname</div>
                                            <div className="item"><span className="icon fa fa-user" />Nickname</div>
                                            <div className="item"><span className="icon"><strong>ID</strong></span>Student ID</div>
                                            <div className="item"><span className="icon t-shirt" />T-Shirt Size</div>
                                        </div>
                                    </div>
                                    <div className="Bottom">
                                        <div className="btn-round shade-red">
                                            DISAPPROVE
                                        </div>
                                        <div className="btn-round shade-green" onClick={this.onClickJoin.bind(this)}>
                                            APPROVE
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="number-join">
                                <p className="hr"></p>
                                250 people join this
                                <p className="hr"></p>
                            </div>
                            <div className="sub-detail">
                                <div className="only-fac">
                                    For <strong>Engineering student</strong> only
                                </div>
                                <div className="time">
                                    16:00 - 20:00 | 30 - 31 January 2017
                                </div>
                                <div className="location">
                                    Sala Prakeaw
                                </div>
                                <div className="box">
                                    <div data-role="topic">FIRST MEET</div>
                                    <div data-role="detail">
                                        <p data-role="time">16:00 | 15 JAN 2017</p>
                                        <p data-role="location">Chulachakrabong Bld.</p>
                                    </div>
                                    <div data-role="note">Please bring your stident card to firstmeet</div>
                                </div>
                                <div className="box">
                                    <div data-role="topic">REGISTERATION DURATION</div>
                                    <div data-role="detail">
                                        <p data-role="time">1 JAN 2017 - 10 JAN 2017</p>
                                        <p data-role="location">Chulachakrabong Bld.</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <p className="hr"></p>
                <div className="event-bio">
                    <h3 className="display-none">Bio</h3>
                    {
                        this.state.about.map((text, index) => {
                            return <p key={index}>{text}</p>
                        })
                    }
                </div>
                <p className="hr"></p>
                <div className="event-img-slide">
                    {
                        this.state.picture_large.map((text, index) => {
                            return (
                                <a key={index} href={replaceIncorrectLink(text)}>
                                    <Image src={replaceIncorrectLink(text)} rejectClass="img" />
                                </a>
                            );
                        })
                    }
                </div>
                <p className="hr"></p>
                <div className="event-other">
                    <div className="box" data-role="contact">
                        <div data-role="topic">Contact</div>
                        <div data-role="content">Hello Content</div>
                    </div>
                    <div className="box">
                        <div data-role="topic">Hello</div>
                        <div data-role="content">Hello Content</div>
                    </div>
                    <div className="box">
                        <div data-role="topic">Hello</div>
                        <div data-role="content">Hello Content</div>
                    </div>
                </div>
            </div>
        )

        if(this.state.isLoading) content = (
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
        else if(this.state.error) content = (
            <div className="Warning-Container">
                <div className="Error-Warning-Container">
                    <div className="Error-Warning">
                        <span>
                            {this.state.error}
                        </span>
                    </div>
                </div>
                <button onClick={this.onExit.bind(this)}>
                    Okay
                </button>
            </div>
        )

        return (
            <div className="modal-container">
                <article className="event-detail-fix basic-card-no-glow">
                    <button className="invisible square-round" role="event-exit" onClick={this.onExit.bind(this)}>
                        <img src="../../resource/images/X.svg" />
                    </button>
                    {(isAdmin) ? (adminComponent) : null}
                    {content}
                </article>
                <div className="background-overlay"/>
            </div>
        );
    }
}

eventDetailFix.defaultProps = {
    'eventId': '595ef6c7822dbf0014cb821c'
}

export default autoBind(eventDetailFix);
