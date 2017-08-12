/* eslint-disable */

import React, { Component } from 'react';
import EventDetail from './eventDetail';
import EventDetailFix from './eventDetail2';
import _ from 'lodash';
import { getRandomShade, getEvent, checkIsJoin } from '../actions/common';
import { hostname } from '../actions/index';

const defaultState = {
    'title': 'No Info',
    'poster': '',
    'isJoined': false,
    'channel_name': 'No Info',
    'date_time': [],
    'location': 'No Info',
    'about': `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec interdum eros purus, eu suscipit lorem eleifend eget. Pellentesque a finibus felis. Pellentesque quis neque ut dui finibus iaculis. Fusce ac placerat`,
    'stats': 'No Info',
    'isLoad': false
}

const maxLength = 212;

function replaceIncorrectLink(str) {
    if(typeof(str) === "string") {
        if(str.indexOf("128.199.208.0/") === 0) str = str.replace("128.199.208.0/", hostname);
        else if(str.indexOf("cueventhub.com/") === 0) str = str.replace("cueventhub.com/", hostname)
        else if(str.indexOf("139.59.97.65:1111/") === 0) str = str.replace("139.59.97.65:1111/", hostname)
        return str;
    }
    return null;
}

/*
Override State Format
{
    'title': [String] Event Title,
    'poster': [String] Poster url,
    'channel_name': [String] channel name,
    'date_time': [Array Of Dates or Array of array of dates],
    'location': [String] location as string,
    'about': [String] first paragraph,
    'stats': [String]
}

Input props
- overrideState - [See above],
- eventId - [String],
- detail-shown - [Boolean],
- noGlow - [String] string of boolean,
- onSetItem - [function],
- onToggle - [function],
- isJoined - [Boolean]
*/

function getSet(obj, key, defaultValue) {
    if(typeof(obj) === "object" && obj !== null) {
        if(obj[key] !== null && typeof(obj[key]) !== "undefined") return obj[key];
        return (defaultValue) ? defaultValue : null;
    }
    return null;
}

class DivImg extends Component {
    constructor(props) {
        super(props);
        this.state = {
            'isError': false,
            'defaultShade': getRandomShade()
        }
        this.onError = this.onError.bind(this);
        this.setStyle = this.setStyle.bind(this);
    }

    setStyle() {
        if(this.state.isError) {
            //Shade div
            return {'background': 'inherit'};
        }
        return {'backgroundImage': `url('${this.props.src}')`};
    }

    onError() {
        this.setState({
            ...this.state,
            'isError': true
        });
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.src !== nextProps.src) {
            this.setState({
                ...this.state,
                'isError': false
            })
        }
    }

    render() {
        let new_className = `${(this.props.options && this.props.options.className) ? this.props.options.className : ''} ${(this.state.isError) ? this.state.defaultShade : ''}`;
        return (
            <div className={new_className} style={this.setStyle()} {...this.props.options}>
                <img src={replaceIncorrectLink(this.props.src)} style={{
                        'position': 'absolute',
                        'height': '0px',
                        'width': '0px',
                        'top': '-9999px',
                        'left': '-9999px'
                    }} onError={this.onError} />
            </div>
        );
    }
}

class eventItem extends Component {
    constructor(props) {
        super(props);
        this.onButtonClick = this.onButtonClick.bind(this);
        let tmp = { ...defaultState };
        if(this.props.overrideState) {
            Object.keys(defaultState).forEach((key) => {
                if(this.props.overrideState[key]) tmp[key] = this.props.overrideState[key];
            })
        }
        tmp.isJoined = (typeof(this.props.isJoined) === "boolean") ? this.props.isJoined : (typeof(this.props.isJoined) === "string") ? (this.props.isJoined === "true") : false;
        this.state = tmp;
    }

    componentWillMount() {
        if(typeof(this.props.eventId) === "string" && !this.state.isLoad) {
            this.onLoadData(this.props.eventId);
        }

        if(this.props.isLoad) {
            this.setState({
                ...this.state,
                isLoad: true
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        if(typeof(nextProps.eventId) === "string" && !this.state.isLoad || !this.props.isLoad && nextProps.isLoad) {
            this.onLoadData(nextProps.eventId);
        }
    }

    onLoadData(id) {
        getEvent(id, false).then((res) => {
            if(this._isMounted) {
                this.setState((prevState) => {
                    return ({
                        ...prevState,
                        title: _.get(res, 'title', defaultState.title),
                        poster: _.get(res, 'picture', defaultState.poster),
                        channel_name: _.get(res, 'channel_name', defaultState.channel_name),
                        location: _.get(res, 'location', defaultState.location),
                        about: _.get(res, 'about[0]', defaultState.about),
                        isLoad: true,
                        date_time: _.get(res, 'time_each_day', [])
                    })
                })
            }
        }).catch((e) => {
            console.log(e);
        })

        // this.setState((prevState) => {
        //     return ({
        //         ...prevState,
        //         title: '',
        //         poster: '',
        //         channel_name: '',
        //         location: '',
        //         about: '',
        //         isLoad: true,
        //         date_time: []
        //     })
        // })
    }

    onButtonClick() {
        this.props.onSetItem(<EventDetailFix eventId={this.props.eventId} onToggle={this.props.onToggle} />);
        this.props.onToggle();
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        let detailShownClass = (this.props["detail-shown"] === "false") ? "card-only" : "";
        detailShownClass += (this.props.noGlow === "true") ? " basic-card-no-glow" : "";

        let tmp = { ...this.state };
        if(this.props.overrideState) {
            Object.keys(defaultState).forEach((key) => {
                if(this.props.overrideState[key]) tmp[key] = this.props.overrideState[key];
            })
        }

        let dateString = '';
        tmp.isJoined = checkIsJoin(this.props.eventId);

        if(tmp.date_time.length > 0) {
            let dateStart = tmp.date_time[0];
            if(dateStart.constructor === Array) dateStart = new Date(dateStart[0]);
            else dateStart = new Date(dateStart);
            let dateEnd = tmp.date_time[tmp.date_time.length - 1];
            if(dateEnd.constructor === Array) dateEnd = new Date(dateEnd[1]);
            else dateEnd = new Date(dateEnd);

            let toNormString = function(date) {
                return date.toString().slice(8, 10) + ' ' + date.toString().slice(4,7) + ' ' + date.toString().slice(11,15);
            }

            if(dateStart.toISOString().slice(0,10) === dateEnd.toISOString().slice(0,10)) dateString = toNormString(dateStart);
            else if(dateStart.getMonth() === dateEnd.getMonth() && dateStart.getFullYear() === dateEnd.getFullYear()) dateString = dateStart.toString().slice(8, 10) + ' - ' + toNormString(dateEnd);
            else if(dateStart.getFullYear() === dateEnd.getFullYear()) dateString = toNormString(dateStart).slice(0, 6) + ' - ' + toNormString(dateEnd);
            else dateString = toNormString(dateStart) + ' - ' + toNormString(dateEnd);
        } else {
            dateString = 'Unknown'
        }

        return (
            <article role="event-item" className={detailShownClass} onClick={this.onButtonClick}>
                <h3 className="display-none">{tmp.title}</h3>
                <DivImg src={replaceIncorrectLink(tmp.poster)} options={{'role': 'main-poster', 'alt': 'main-poster'}} />
                <div role="overlay" aria-hidden="true"></div>
                {
                    (tmp.isJoined) ? (<span className="small top" role="joined"><i className="fa fa-check" aria-hidden="true"></i> Joined</span>) : (<span className="small top" role="joined" style={{'display': 'block', 'height': '1em'}}/>)
                }
                <section content="detail">
                    <h4 className="display-none">Info</h4>
                    <header role="top-detail">
                        {
                            (tmp.isJoined) ? (<span className="small join-section" role="joined"><i className="fa fa-check" aria-hidden="true"></i> Joined</span>) : null
                        }
                        <span className="big">{tmp.title}</span>
                        <span className="medium">by {tmp.channel_name}</span>
                    </header>
                    <p className="hr" aria-hidden="true" />
                    <section role="middle-detail">
                        <h5 className="display-none">Date and Location</h5>
                        <span className="medium icon-line">
                            <i className="fa fa-calendar" aria-hidden="true"></i>
                             {dateString}
                            </span>
                        <span className="medium icon-line">
                            <i className="fa fa-map-marker" aria-hidden="true"></i>
                             {tmp.location}
                         </span>
                    </section>
                    <section role="bio" className="medium">
                        <h5 className="display-none">Bio</h5>
                        {_.truncate(tmp.about, {
                            'length': maxLength
                        })}
                    </section>
                    <footer role="bottom" className="small">
                        <span role="description">{tmp.stats}</span>
                    </footer>
                </section>
            </article>
        );
    }
}

eventItem.defaultProps = {
    'eventId': '',
    'isLoad': true,
    'isJoined': false
}

export default eventItem;
