import React, { Component } from 'react';
import '../container/css/eventDetail2.css'
import './css/searchResult.css'
import EventItem from '../container/eventItem';

class SearchResult extends Component {

    render() {
        let addtitonalStyle = (this.props.noBg) ? {
            'top': '165px',
            'height': 'calc(100vh - 65px - 100px)'
        } : {}
        return (
            <div  className="search-box-container" style={addtitonalStyle}>
                <article className="event-search">
                    <div className="keyword">Keyword</div>
                    <div className="found">found 17 results</div>
                    <div className="event-found">
                        <EventItem posterSrc={`../../resource/images/poster_dummy/1.jpg`} detail-shown="true" />
                        <EventItem posterSrc={`../../resource/images/poster_dummy/1.jpg`} detail-shown="true" />
                        <EventItem posterSrc={`../../resource/images/poster_dummy/1.jpg`} detail-shown="true" />
                        <EventItem posterSrc={`../../resource/images/poster_dummy/1.jpg`} detail-shown="true" />
                        <br />
                        <EventItem posterSrc={`../../resource/images/poster_dummy/1.jpg`} detail-shown="false" />
                        <EventItem posterSrc={`../../resource/images/poster_dummy/1.jpg`} detail-shown="false" />
                        <EventItem posterSrc={`../../resource/images/poster_dummy/1.jpg`} detail-shown="false" />
                        <EventItem posterSrc={`../../resource/images/poster_dummy/1.jpg`} detail-shown="false" />
                        <EventItem posterSrc={`../../resource/images/poster_dummy/1.jpg`} detail-shown="false" />
                        <EventItem posterSrc={`../../resource/images/poster_dummy/1.jpg`} detail-shown="false" />
                        <EventItem posterSrc={`../../resource/images/poster_dummy/1.jpg`} detail-shown="false" />
                        <EventItem posterSrc={`../../resource/images/poster_dummy/1.jpg`} detail-shown="false" />
                        <EventItem posterSrc={`../../resource/images/poster_dummy/1.jpg`} detail-shown="false" />
                    </div>
                </article>
                {(this.props.noBg) ? (null) : (<div className="background-overlay-fix"/>) }
            </div>
        );
    }
}

export default SearchResult;
