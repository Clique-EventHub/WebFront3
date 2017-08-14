import React, { Component } from 'react';
import './css/eventDetail2.css'
import * as facultyMap from '../actions/facultyMap';
import axios from 'axios';
import { hostname, urlName } from '../actions/index';
import { getCookie, getChannel, checkAdmin, dateToFormat, shortenRangeDate, fieldsToIconFiles, ServerToClientFields } from '../actions/common';
import ReactLoading from 'react-loading';
import { Link } from 'react-router';
import Image from '../components/Image';
import autoBind from '../hoc/autoBind';
import _ from 'lodash';
import VideoIframe from '../components/VideoIframe';
import ErrorPopUp from '../components/ErrorPopUp';
import EditEvent from './editEvent';

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
    'optional_field': [],
    'refObj': null
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
        if(this._isMounted) {
            this.setState((prevState) => {
                return ({
                    ...prevState,
                    isEnable: !this.state.isEnable
                });
            })
        }
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
        this.onSetError = this.onSetError.bind(this);
        this.state = defaultState;
    }

    onExit() {
        this.props.onToggle();
    }

    componentWillMount() {
        this.onGetInfo();
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
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
            if(this._isMounted) {
                this.setState((prevState, props) => {
                    this.onGetInfo(nextProps.eventId);
                    return defaultState;
                });
            }
        }
    }

    onGetInfo(overrideId) {
        if(this._isMounted) {
            this.setState((prevState) => {
                return ({
                    ...prevState,
                    'isLoading': true
                })
            });
        }

        const id = overrideId || this.props.eventId;

        axios.get(`${hostname}event?id=${id}`, { headers: { 'crossDomain': true }}).then((data) => {
            if(this._isMounted) {
                this.setState((prevState) => {
                    return ({
                        ...defaultState,
                        ...data.data,
                        'refObj': data.data,
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
            }
            this.onResetPopup();
            return data.data;
        }).then((event) => {
            getChannel(event.channel, false).then((res) => {
                if(this._isMounted) {
                    this.setState((prevState) => {
                        return ({
                            ...prevState,
                            'channel': res
                        });
                    });
                }
                this.onResetPopup();
            })
        }).catch((error) => {
            if(this._isMounted) {
                this.setState((prevState) => {
                    return ({
                        ...prevState,
                        'error': 'Oh! Ow! Something went wrong. Please check your internet connection',
                        'isLoading': false
                    });
                });
            }
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
            //console.log(data);
        }).catch((e) => {
            //console.log(e);
        })
    }

    onSetError(error) {
        this.props.blur_bg();
        if(error.response) {
            this.props.set_pop_up_item(<ErrorPopUp onExit={this.props.toggle_pop_item} errorMsg={`Oh! Ow! something went wrong!`} errorDetail={`Got Error code: ${error.response.status} with message "${error.response.data.msg}"`} />);
        } else {
            this.props.set_pop_up_item(<ErrorPopUp onExit={this.props.toggle_pop_item} errorMsg={`Oh! Ow! something went wrong!`} errorDetail="Please check your internet connection" />);
        }
        this.props.display_pop_item();
    }

    onClickJoin() {
        const config = {
            'headers': {
                'Authorization': ('JWT ' + getCookie("fb_sever_token"))
            }
        }

        new Promise((gg, bg) => {
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
            }).catch((error) => {
                bg(error);
            })

        }).then((whatever) => {
            if(_.get(this.state.refObj, 'forms', []).length > 0) {
                this.props.context.router.push(`/form?id=${_.get(this.state.refObj, 'forms', [])[0]}`);
            } else {
                this.onBtnClick("warning-popup");
            }
        }).catch((e) => {
            this.onSetError(e);
        })
    }

    onRedirectTable() {
        this.props.context.router.push(`/table?eid=${_.get(this.props, 'eventId', '')}`);
    }

    onClickEdit() {
        this.props.blur_bg();
        this.props.set_pop_up_item(<EditEvent eventId={_.get(this.props, 'eventId', '')} channelId={_.get(this.state, 'refObj.channel', '')} />);
        this.props.display_pop_item();
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

        const isAdmin = checkAdmin(this.props.eventId);
        let adminComponent = (
            <div>
                <div className="flex">
                    <div className="btn-top" onClick={this.onClickEdit.bind(this)}>EDIT</div>
                    <div className="btn-top" onClick={this.onRedirectTable.bind(this)}>PARTICIPANTS LIST</div>
                </div>
                <p className="hr" />
            </div>
        )

        const notes = _.get(this.state, 'notes', []);

        let firstMeetDate = ''
        if(notes.length === 2 && new Date(_.get(notes, '[0].content.dates[0]')).toString() !== "Invalid Date") {
            firstMeetDate = `${_.get(notes, '[0].content.time')} | ${shortenRangeDate(new Date(_.get(notes, '[0].content.dates[0]')), new Date(_.get(notes, '[0].content.dates[0]')))}`;
        } else {
            firstMeetDate = ''
        }

        let recruitmentDate = ''
        const recruitmentDateArray = _.get(notes, '[1].content', []);

        const startDate = _.get(recruitmentDateArray, '[0][0]');
        const endDateArray = _.get(recruitmentDateArray, `[${recruitmentDateArray.length-1}]`, []);
        const endDate = _.get(endDateArray, `[${endDateArray.length-1}]`);

        if(notes.length === 2 && new Date(startDate).toString() !== "Invalid Date" && new Date(endDate).toString() !== "Invalid Date") {
            recruitmentDate = `${shortenRangeDate(new Date(startDate), new Date(endDate))}`;
        } else {
            recruitmentDate = ''
        }

        const boxes = (notes.length === 2) ? [
            <div className="box" key="0">
                <div data-role="topic">{_.get(notes, '[0].title', '')}</div>
                <div data-role="detail">
                    <p data-role="time">{firstMeetDate}</p>
                    <p data-role="location">{_.get(notes, '[0].content.location', '')}</p>
                </div>
                {
                    (_.get(notes, '[0].note', '').length > 0) ? (
                        <div data-role="note">{_.get(notes, '[0].note', '')}</div>
                    ) : null
                }
            </div>,
            <div className="box" key="1">
                <div data-role="topic">{_.get(notes, '[1].title', '')}</div>
                <div data-role="detail">
                    <p data-role="time">{recruitmentDate}</p>
                </div>
            </div>
        ] : [];

        const timeString = ((new Date(_.get(this.state.refObj, 'time_start')).toString() !== "Invalid Date") && (new Date(_.get(this.state.refObj, 'time_end')).toString() !== "Invalid Date")) ? (
            `${new Date(_.get(this.state.refObj, 'time_start')).toString().slice(16,21)} - ${new Date(_.get(this.state.refObj, 'time_end')).toString().slice(16,21)}`
        ) : '';
        const dateString = ((new Date(_.get(this.state.refObj, 'date_start')).toString() !== "Invalid Date") && (new Date(_.get(this.state.refObj, 'date_end')).toString() !== "Invalid Date")) ? (
            `${shortenRangeDate(new Date(_.get(this.state.refObj, 'date_start')), new Date(_.get(this.state.refObj, 'date_end')))}`
        ) : '';

        const dateTimeString = (timeString.length > 0 || dateString.length > 0) ? `${timeString} | ${dateString}` : '';

        const contactObj = JSON.parse(_.get(this.state.refObj, 'contact_information', '[]'));
        let contactChunk = (contactObj.length > 0) ? [<hr className="thin" key={0} />,
        <ul key={1}>
            {
                contactObj.map((info, index) => {
                    return (
                        <li key={index}>
                            {info.name}<br />{info.info}
                        </li>
                    );
                })
            }
        </ul>] : [];

        let content = (
            <div>
                <div className="top-moving">
                    <div className="toggle">
                        {eventName}
                    </div>
                    <div className="event-poster-fix">
                        <Image src={replaceIncorrectLink(this.state.picture)} imgOption={{'alt': 'main-poster'}} rejectClass="flex-1 min-height-400" />
                        {
                            (isImplement) ? (
                                <div className="tags-container">
                                    <div data-icon="tag" />
                                    <div data-icon="tag" />
                                    <div data-icon="tag" />
                                </div>
                            ) : null
                        }
                    </div>
                    <div className="column">
                        <div className="toggle-not">
                            {eventName}
                        </div>
                        <div className="event-info">
                            <div className="share-interest-join" aria-hidden="true">
                                <div className="float-left" onClick={() => {this.onBtnClick("share-popup")}}><i className="fa fa-share-square-o" aria-hidden="true"></i> SHARE</div>
                                <div className="to-right" >
                                    <button alt="btn-interest" className="cursor-disable" ref={(btn) => this.interestBtn = btn} onClick={this.onClickInterest.bind(this)}>INTEREST</button>
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
                                        Are you sure that you will register to this event? Your information will sent to event creator. Once user is joined, cannot be unjoined.
                                    </div>
                                    <div className="field-show-container">
                                        <div className="field-show">
                                            {
                                                _.get(this.state.refObj, 'optional_field', []).concat(_.get(this.state.refObj, 'require_field', [])).map((field, index) => {
                                                    return (
                                                        <div className="item flex alignsItem" key={index}>
                                                            <img src={`./resource/icon/${fieldsToIconFiles[field]}`} style={{
                                                                    'display': 'inline-block',
                                                                    'width': '1.5em',
                                                                    'height': '1.5em',
                                                                    'marginRight': '5px',
                                                                }}/>{ServerToClientFields[field]}</div>
                                                    );
                                                })
                                            }
                                        </div>
                                    </div>
                                    <div className="Bottom">
                                        <div className="btn-round shade-red" onClick={() => this.onBtnClick("warning-popup")}>
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
                                {
                                    (isImplement) ? (
                                        ["250 people join this", <p className="hr" />]
                                    ) : null
                                }
                            </div>
                            <div className="sub-detail">
                                <div className="only-fac">
                                    For <strong>Engineering student</strong> only
                                </div>
                                <div className="time">
                                    {dateTimeString}
                                </div>
                                {
                                    (_.get(this.state, 'refObj.location', '').length > 0) ? (
                                        <div className="location">
                                            {_.get(this.state, 'location', '')}
                                        </div>
                                    ) : null
                                }
                                {boxes}
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
                <p className="hr" />
                <VideoIframe src={_.get(this.state, 'refObj.video', '')} afterRender={[<p className="hr" key={0}/>]} />
                <div className="event-other">
                    {(contactObj.length > 0) ? (
                        <div className="box" data-role="contact">
                            <div data-role="topic">CONTACT</div>
                            {contactChunk}
                        </div>
                    ) : null }
                    {
                        (_.get(this.state.refObj, 'refs', []).filter((item) => item.note === "file").length > 0) ? (
                            <div className="box">
                                <div data-role="topic">FILES</div>
                                    <hr className="thin" />
                                    <ul>
                                        {
                                            _.get(this.state.refObj, 'refs', []).filter(
                                                (item) => item.note === "file"
                                            ).map(
                                                (item, index) => {
                                                    return (
                                                        <li key={`file-${index}`}>>
                                                            <a href={item.content}>
                                                                {_.truncate(item.title, {
                                                                    'length': 15
                                                                })}
                                                            </a>
                                                        </li>
                                                    );
                                                }
                                            )
                                        }
                                    </ul>
                            </div>
                        ) : null
                    }
                    {
                        (_.get(this.state.refObj, 'refs', []).filter((item) => item.note === "url").length > 0) ? (
                            <div className="box">
                                <div data-role="topic">LINKS</div>
                                    <hr className="thin"/>
                                    <ul>
                                        {
                                            _.get(this.state.refObj, 'refs', []).filter(
                                                (item) => item.note === "url"
                                            ).map(
                                                (item, index) => {
                                                    return (
                                                        <li key={`url-${index}`}>
                                                            <a href={item.content}>
                                                                {_.truncate(item.content, {
                                                                    'length': 15
                                                                })}
                                                            </a>
                                                        </li>
                                                    );
                                                }
                                            )
                                        }
                                    </ul>
                            </div>
                        ) : null
                    }
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
