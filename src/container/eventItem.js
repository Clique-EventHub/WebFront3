/* eslint-disable */

import React, { Component } from 'react';
import EventDetail from './eventDetail';
import EventDetailFix from './eventDetail2';
import _ from 'lodash';
import { getRandomShade } from '../actions/common';
import axios from 'axios';
import { hostname } from '../actions/index';

const defaultState = {
    'title': 'Hello',
    'poster': "https://about.canva.com/wp-content/uploads/sites/3/2015/01/concert_poster.png",
    'isJoined': false,
    'channel_name': 'Creator Name',
    'date_time': [],
    'location': 'Chulachakrabong Bld.',
    'about': `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec interdum eros purus, eu suscipit lorem eleifend eget. Pellentesque a finibus felis. Pellentesque quis neque ut dui finibus iaculis. Fusce ac placerat`,
    'stats': '360 peoples join this',
    'isLoad': false
}

const maxLength = 212;

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
                <img src={this.props.src} style={{
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

    componentWillReceiveProps(nextProps) {
        if(typeof(nextProps.eventId) === "string" || !this.state.isLoad) {
            this.onLoadData(nextProps.eventId);
        }
    }

    onLoadData(id) {
        axios.get(`${hostname}event?id=${id}&stat=false`).then((res) => {
            this.setState({
                ...this.state,
                'title': res.data.title,
                'poster': res.data.picture_large[0],
                'channel_name': res.data.channel_name,
                'location': res.data.location,
                'about': res.data.about,
                'isLoad': true
            });
        }).catch((e) => {
            console.log(e);
        })
    }

    onButtonClick() {
        this.props.onSetItem(<EventDetailFix onToggle={this.props.onToggle} />);
        this.props.onToggle();
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

        if(tmp.date_time.length > 0) {
            let dateStart = tmp.date_time[0];
            if(dateStart.constructor === Array) dateStart = dateStart[0];
            let dateEnd = tmp.date_time[tmp.date_time.length - 1];
            if(dateEnd.constructor === Array) dateEnd = dateEnd[1];

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
                <DivImg src={tmp.poster} options={{'role': 'main-poster', 'alt': 'main-poster'}} />
                <div role="overlay" aria-hidden="true"></div>
                {
                    (this.state.isJoined) ? (<span className="small top" role="joined"><i className="fa fa-check" aria-hidden="true"></i> Joined</span>) : (<span className="small top" role="joined" style={{'display': 'block', 'height': '1em'}}/>)
                }
                <section content="detail">
                    <h4 className="display-none">Info</h4>
                    <header role="top-detail">
                        {
                            (tmp.isJoined) ? (<span className="small" role="joined"><i className="fa fa-check" aria-hidden="true"></i> Joined</span>) : null
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
    'eventId': '594bf476e374d100140f04ec'
}

export default eventItem;
