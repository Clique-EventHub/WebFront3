import React, { Component } from 'react';
import './css/eventDetail2.css'
import * as facultyMap from '../actions/facultyMap';
import axios from 'axios';
import { hostname } from '../actions/index';
import ReactLoading from 'react-loading';

//https://codepen.io/bh/pen/JBlCc
let useCls = " toggle-vis";
const codeList = facultyMap.getCodeList();
let index = 0;

const defaultState = {
    'title': null,
    'about': null,
    'video': null,
    'channel': null,
    'location': null,
    'date_start': null,
    'expire': null,
    'date_end': null,
    'picture': null,
    'picture_large': null,
    'year_require': null,
    'faculty_require': null,
    'tags': null,
    'forms': null,
    'isLoading': true,
    'error': null
}

class eventDetailFix extends Component {

    constructor(props) {
        super(props);
        this.onBtnClick = this.onBtnClick.bind(this);
        this.onResetPopup = this.onResetPopup.bind(this);
        this.onGetInfo = this.onGetInfo.bind(this);
        this.state = defaultState;
    }

    onExit() {
        this.props.onToggle();
    }

    componentDidMount() {
        this.onResetPopup();
        this.onGetInfo();
    }

    componentDidUpdate() {
        console.log(this.state);
    }

    onGetInfo() {
        this.setState({
            ...this.state,
            'isLoading': true
        });
        axios.get(`${hostname}event?id=${this.props.eventId}`).then((data) => {
            let rObj = {
                ...defaultState,
                ...data.data,
                isLoading: false
            }
            this.setState(rObj);
            this.onResetPopup();
            return data.data;
        }).then((event) => {
            axios.get(`${hostname}channel?id=${event.channel}&stat=false`).then((res) => {
                this.setState({
                    ...this.state,
                    'channel': res.data
                });
                this.onResetPopup();
            })
        }).catch((error) => {
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

    render() {

        let eventName = (
            <div className="event-name">
                <h2>{this.state.title}</h2>
                <div className="flex">
                    <img data-icon="channel-icon" alt="channel-icon" /><span> {this.state.channel_name}</span>
                </div>
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
                        <div>
                            <img src="../../resource/images/poster_dummy/10.jpg" alt="main-poster" />
                            <div className="tags-container">
                                <div data-icon="tag" />
                                <div data-icon="tag" />
                                <div data-icon="tag" />
                            </div>
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
                                    <button alt="btn-interest">INTEREST</button>
                                    <button alt="btn-join" onClick={() => {this.onBtnClick("warning-popup")}}>JOIN</button>
                                </div>
                                <div className={`warning-pop-up basic-card-no-glow ${useCls}`} data-role="share-popup" ref="share-popup">
                                    <div className="btn-c btn-facebook" />
                                    <div className="btn-c btn-twitter" />
                                    <div className="btn-c btn-share" />
                                    <div className="btn-invite shade-blue" onClick={() => {this.onBtnClick("invite-popup")}}>INVITE</div>
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
                                                        <img alt="profile" />
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
                                            <div className="item"><span className="icon fa fa-user" />Name - Surname</div>
                                            <div className="item"><span className="icon fa fa-user" />Nickname</div>
                                            <div className="item"><span className="icon"><strong>ID</strong></span>Student ID</div>
                                            <div className="item"><span className="icon t-shirt" />T-Shirt Size</div>
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
                                        <div className="btn-round shade-green">
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
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque id ipsum orci. Aliquam erat volutpat. Sed in erat quis mi laoreet vestibulum. Fusce vitae tempor nisi. Fusce aliquam dolor mi, sit amet egestas ex imperdiet fringilla. Nullam nisl quam, convallis vitae viverra in, lacinia nec lectus. Praesent nibh metus, luctus nec tortor sit amet, hendrerit congue elit. Aliquam erat volutpat. Quisque ex arcu, iaculis blandit arcu at, molestie mattis mauris. Etiam in tortor nec metus eleifend euismod. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
                    </p>
                    <p>
                        Nulla congue tincidunt sem non ullamcorper. Etiam mattis auctor tellus. Aenean ultricies lacus at elementum fermentum. Nunc hendrerit neque et nibh sodales, a malesuada orci euismod. Aliquam a pharetra purus, nec porta augue. Donec in elit non arcu commodo tristique. Integer nunc ligula, tristique eget nisl non, consectetur pharetra lacus.
                    </p>
                    <p>
                        Cras pellentesque enim justo, id pharetra neque pulvinar quis. Suspendisse a odio lacinia, maximus dolor et, maximus massa. Curabitur dolor nibh, pulvinar imperdiet nunc id, placerat venenatis massa. Donec vitae venenatis nisi. Ut iaculis sem a tempor ullamcorper. Ut aliquam venenatis fermentum. Nam porttitor libero sit amet nisl mattis, sed tincidunt eros tincidunt.
                    </p>
                </div>
                <p className="hr"></p>
                <div className="event-img-slide">
                    <a href="https://s-media-cache-ak0.pinimg.com/736x/a9/d5/ff/a9d5ffc839c6fd69bd76bdd1e81fb42d.jpg">
                        <img src="https://s-media-cache-ak0.pinimg.com/736x/a9/d5/ff/a9d5ffc839c6fd69bd76bdd1e81fb42d.jpg" />
                    </a>
                    <a href="https://s-media-cache-ak0.pinimg.com/736x/2c/06/90/2c0690f83727e1bf7d7d3f1eb60685bb.jpg">
                        <img src="https://s-media-cache-ak0.pinimg.com/736x/2c/06/90/2c0690f83727e1bf7d7d3f1eb60685bb.jpg" />
                    </a>
                    <a href="ttp://dl9fvu4r30qs1.cloudfront.net/47/3f/b9398ff842278569608c449da077/enemy-poster.jpg">
                        <img src="http://dl9fvu4r30qs1.cloudfront.net/47/3f/b9398ff842278569608c449da077/enemy-poster.jpg" />
                    </a>
                    <a href="https://s-media-cache-ak0.pinimg.com/736x/62/0c/aa/620caa23db6fa40d16f494ac17a47982.jpg">
                        <img src="https://s-media-cache-ak0.pinimg.com/736x/62/0c/aa/620caa23db6fa40d16f494ac17a47982.jpg" />
                    </a>
                    <a href="https://s-media-cache-ak0.pinimg.com/736x/d7/d6/ae/d7d6ae768606d96d23ee247827d79c73.jpg">
                        <img src="https://s-media-cache-ak0.pinimg.com/736x/d7/d6/ae/d7d6ae768606d96d23ee247827d79c73.jpg" />
                    </a>
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
                    <ReactLoading type={'bars'} color={'#878787'} height='40' width='40' />
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
    'eventId': '594bf476e374d100140f04ec'
}

export default eventDetailFix;
