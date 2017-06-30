import React, { Component } from 'react';
import '../container/css/eventDetail2.css'
import './css/searchResult.css'
import EventItem from '../container/eventItem';
import axios from 'axios';

class SearchResult extends Component {
    constructor(props) {
        super(props);


    }


    render() {
        let addtitonalStyle = (this.props.noBg) ? {
            'top': '165px',
            'height': 'calc(100vh - 65px - 100px)'
        } : {}
        var ID;
        axios.get('http://128.199.208.0:1111/event/search?keyword=' + this.props.keyword).then((data) => {
            console.log("get!!!->dsfdfdf");
            ID = JSON.stringify(data.data.events[0]._id);
            // _this.state = {
            //     'title': data.data.title,
            //     'about': data.data.about,
            //     'channel': data.data.channel,
            //     'video': data.data.video,
            //     'location': data.data.location,
            //     'date_start': data.data.date_start,
            //     'date_end': data.data.date_end,
            //     'picture': data.data.picture,
            //     'picture_large': data.data.picture_large,
            //     'year_require': data.data.year_require,
            //     'faculty_require': data.data.faculty_require,
            //     'tags': data.data.tags,
            //     'forms': data.data.forms,
            //
            //     'new_title': data.data.title,
            //     'new_about': data.data.about,
            //     'new_channel': data.data.channel,
            //     'new_video': data.data.video,
            //     'new_location': data.data.location,
            //     'new_date_start': data.data.date_start,
            //     'new_date_end': data.data.date_end,
            //     'new_picture': data.data.picture,
            //     'new_picture_large': data.data.picture_large,
            //     'new_year_require': data.data.year_require,
            //     'new_faculty_require': data.data.faculty_require,
            //     'new_tags': data.data.tags,
            //     'new_forms': data.data.forms,
            // }
        }, (error) => {
            console.log("get event error");
        });

        return (
            <div  className="search-box-container" style={addtitonalStyle}>
                <article className="event-search">
                    <div className="keyword">Keyword</div>
                    <div className="found">found 17 results</div>
                    <div className="event-found">
                        <EventItem eventId={ID} posterSrc={`../../resource/images/poster_dummy/1.jpg`} detail-shown="true" />
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
