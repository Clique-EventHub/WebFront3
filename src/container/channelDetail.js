import React, { Component } from 'react';
import './css/channelDetail.css';
import Image from '../components/Image';
import VideoIframe from '../components/VideoIframe';
import axios from 'axios';
import { hostname } from '../actions/index';
import ReactLoading from 'react-loading';
import _ from 'lodash';

class channelDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            'name': "",
            'picture': "",
            'detail': [""],
            'picture_large': [],
            'isLoad': false,
            'url': '',
            'video': '',
            'isFollow': this.props.isFollow
        }
    }

    componentWillMount() {
        axios.get(`${hostname}channel?id=${this.props.channelId}`).then((data) => {
            this.setState((prevState) => {
                return ({
                    ...prevState,
                    'name': data.data.name,
                    'picture': data.data.picture,
                    'detail': data.data.detail,
                    'picture_large': _.get(data, 'data.picture_large', []),
                    'url': _.get(data, 'data.url', ''),
                    'video': _.get(data, 'data.video', ''),
                    'isLoad': true
                });
            })
        }, (error) => {
            // console.log("get channel error");
        });
    }

    onExit() {
        this.props.onToggle();
    }

    onClick() {
        const nextState = this.props.onToggleFollow();
        this.setState((prevState) => {
            return ({
                ...prevState,
                'isFollow': nextState
            });
        })
    }

    render () {
        // console.log(this.state.picture_large);
        const content = (this.state.isLoad) ? (
            <section>
                <div className="flex">
                    <Image src={this.state.picture} imgClass="chan-img" rejectClass="chan-img" />
                    <div className="side-style">
                        <h2 className="chan-name">{this.state.name}</h2>
                        <button
                            className={`bt-fol ${this.state.isFollow ? 'follow-active' : ''}`}
                            alt="btn-follow"
                            onClick={this.onClick.bind(this)}
                        >{ (this.state.isFollow) ? 'FOLLOWING' : 'FOLLOW' }</button>
                    </div>
                </div>
                <hr className="thin" />
                <div className="event-bio">
                    <h3 className="display-none">Bio</h3>
                    {
                        (this.state.detail.constructor === Array) ?
                        this.state.detail.map((text, index) => <p key={index}>{text}</p>) : (<p>{this.state.detail}</p>)
                    }
                </div>
                <div className="marginleft">
                    <div className="chan-img-slide">
                        {
                            this.state.picture_large.map((url, index) => {
                                return <a href={url} key={index}><Image src={url} rejectClass="img-fallback" /></a>
                            })
                        }
                    </div>
                    <hr className="thin" />
                    <VideoIframe src={this.state.video} />
                    <a href={this.state.url} className="box">
                        LINK
                        <div>{this.state.url}</div>
                    </a>
                </div>
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
        )

        return (
            <div className="modal-container">
                <article className="edit-event basic-card-no-glow modal-main card-width channel-detail">
                    <button className="card-exit invisible square-round" role="event-exit" onClick={this.onExit.bind(this)}>
                        <img src="../../resource/images/X.svg" />
                    </button>
                    {
                        content
                    }
                </article>
                <div className="background-overlay" onClick={this.props.onToggle} />
            </div>

        )

    }
}

channelDetail.defaultProps = {
    'channelId': "595ef6b8822dbf0014cb821b",
    'onToggleFollow': () => {}
}

export default channelDetail;
