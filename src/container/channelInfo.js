import React, { Component } from 'react';
import './css/eventDetail2.css'
import * as facultyMap from '../actions/facultyMap';
import axios from 'axios';
import { hostname } from '../actions/index';
import ReactLoading from 'react-loading';
import './css/channelInfostyle.css';

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

class channelInfo extends Component {

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
                            <img className="chan-img" href="../../resource/images/poster_dummy/dummyProflie.png"/>


                    <div className="column">
                        <div className="toggle-not">
                            {eventName}
                        </div>


                                <div className="to-right" >
                                    <button alt="btn-interest">INTEREST</button>
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

channelInfo.defaultProps = {
    'eventId': '594bf476e374d100140f04ec'
}

export default channelInfo;
