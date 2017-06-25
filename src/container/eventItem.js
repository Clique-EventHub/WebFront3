/* eslint-disable */

import React, { Component } from 'react';
import EventDetail from './eventDetail';
import EventDetailFix from './eventDetail2';

const defaultState = {
    'eventName': 'Hello',
    'poster': "https://about.canva.com/wp-content/uploads/sites/3/2015/01/concert_poster.png",
    'isJoined': false,
    'channelName': 'Creator Name',
    'dateString': '29 JAN 2017',
    'locationString': 'Chulachakrabong Bld.',
    'detail': `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec interdum eros purus, eu suscipit lorem eleifend eget. Pellentesque a finibus felis. Pellentesque quis neque ut dui finibus iaculis. Fusce ac placerat...`,
    'statString': '360 peoples join this'
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
        this.state = tmp;
    }

    onButtonClick() {
        this.props.onSetItem(<EventDetailFix onToggle={this.props.onToggle} />);
        this.props.onToggle();
    }

    render() {
        let detailShownClass = (this.props["detail-shown"] === "false") ? "card-only" : "";
        detailShownClass += (this.props.noGlow === "true") ? " basic-card-no-glow" : "";

        const posterObj = (this.props.posterSrc) ? <div role="main-poster" alt="main-poster" style={{backgroundImage: `url('${this.props.posterSrc}')`}} /> : <div role="main-poster" alt="main-poster" style={{backgroundImage: `url('${this.state.poster}')`}}/>;

        return (
            <article role="event-item" className={detailShownClass} onClick={this.onButtonClick}>
                <h3 className="display-none">{this.state.eventName}</h3>
                {posterObj}
                <div role="overlay" aria-hidden="true"></div>
                {
                    (this.state.isJoined) ? (<span className="small top" role="joined"><i className="fa fa-check" aria-hidden="true"></i> Joined</span>) : null
                }
                <section content="detail">
                    <h4 className="display-none">Info</h4>
                    <header role="top-detail">
                        {
                            (this.state.isJoined) ? (<span className="small" role="joined"><i className="fa fa-check" aria-hidden="true"></i> Joined</span>) : null
                        }
                        <span className="big">{this.state.eventName}</span>
                        <span className="medium">by {this.state.channelName}</span>
                    </header>
                    <p className="hr" aria-hidden="true" />
                    <section role="middle-detail">
                        <h5 className="display-none">Date and Location</h5>
                        <span className="medium icon-line">
                            <i className="fa fa-calendar" aria-hidden="true"></i>
                             {this.state.dateString}
                            </span>
                        <span className="medium icon-line">
                            <i className="fa fa-map-marker" aria-hidden="true"></i>
                             {this.state.locationString}
                         </span>
                    </section>
                    <section role="bio" className="medium">
                        <h5 className="display-none">Bio</h5>
                        {this.state.detail}
                    </section>
                    <footer role="bottom" className="small">
                        <span role="description">{this.state.statString}</span>
                    </footer>
                </section>
            </article>
        );
    }
}

eventItem.defaultProps = {
    'eventId': null
}

export default eventItem;
