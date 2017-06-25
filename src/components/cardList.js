/* eslint-disable */

import React, { Component } from 'react';
import EventItem from '../container/eventItem';

class cardList extends Component {
    // constructor(props) {
    //     super(props);
    // }
    render() {
        let posterTest = [];
        for(var i = 1; i < 32; i++) {
            posterTest.push(`../../resource/images/poster_dummy/${i}.jpg`);
        }
        return (
            <section aria-hidden="false" role="card-list">
                <h2 className="display-none">Card List</h2>
                <EventItem posterSrc={posterTest[0]} detail-shown="false" {...this.props} />
                <EventItem posterSrc={posterTest[1]} detail-shown="false" {...this.props} />
                <EventItem posterSrc={posterTest[2]} detail-shown="false" {...this.props} />
                <EventItem posterSrc={posterTest[3]} detail-shown="false" {...this.props} />
                <EventItem posterSrc={posterTest[4]} detail-shown="false" {...this.props} />
                <EventItem posterSrc={posterTest[5]} detail-shown="false" {...this.props} />
                <EventItem posterSrc={posterTest[6]} detail-shown="false" {...this.props} />
                <EventItem posterSrc={posterTest[7]} detail-shown="false" {...this.props} />
                <EventItem posterSrc={posterTest[8]} detail-shown="false" {...this.props} />
                <EventItem posterSrc={posterTest[9]} detail-shown="false" {...this.props} />
                <EventItem posterSrc={posterTest[10]} detail-shown="false" {...this.props} />
                <EventItem posterSrc={posterTest[11]} detail-shown="false" {...this.props} />

            </section>
        );
    }
}

export default cardList;
