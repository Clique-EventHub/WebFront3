import React, { Component } from 'react';
import './css/searchResult.css'
import EventItem from '../container/eventItem';

class SearchResult extends Component {

    render() {
        let addtitonalStyle = (this.props.noBg) ? {
            'top': '165px',
            'height': 'calc(100vh - 65px - 100px)',
            'position': 'fixed',
            'overflowY': 'scroll'
        } : {}
        return (
            <div  className="search-box-container" style={addtitonalStyle} className={this.props.className}>
                <article className="event-search">
                    <div className="keyword truncate">{this.props.keyword}</div>
                    <div className="found">found 17 results</div>
                    <div className="event-found">
                        <EventItem posterSrc={`../../resource/images/poster_dummy/1.jpg`} detail-shown="true" onToggle={this.props.onToggle} onSetItem={this.props.onSetItem} />
                        <EventItem posterSrc={`../../resource/images/poster_dummy/1.jpg`} detail-shown="true" onToggle={this.props.onToggle} onSetItem={this.props.onSetItem}  />
                        <EventItem posterSrc={`../../resource/images/poster_dummy/1.jpg`} detail-shown="true" onToggle={this.props.onToggle} onSetItem={this.props.onSetItem}  />
                        <EventItem posterSrc={`../../resource/images/poster_dummy/1.jpg`} detail-shown="true" onToggle={this.props.onToggle} onSetItem={this.props.onSetItem}  />
                        <br />
                        <EventItem posterSrc={`../../resource/images/poster_dummy/1.jpg`} detail-shown="false" onToggle={this.props.onToggle} onSetItem={this.props.onSetItem}  />
                        <EventItem posterSrc={`../../resource/images/poster_dummy/1.jpg`} detail-shown="false" onToggle={this.props.onToggle} onSetItem={this.props.onSetItem}  />
                        <EventItem posterSrc={`../../resource/images/poster_dummy/1.jpg`} detail-shown="false" onToggle={this.props.onToggle} onSetItem={this.props.onSetItem}  />
                        <EventItem posterSrc={`../../resource/images/poster_dummy/1.jpg`} detail-shown="false" onToggle={this.props.onToggle} onSetItem={this.props.onSetItem}  />
                        <EventItem posterSrc={`../../resource/images/poster_dummy/1.jpg`} detail-shown="false" onToggle={this.props.onToggle} onSetItem={this.props.onSetItem}  />
                        <EventItem posterSrc={`../../resource/images/poster_dummy/1.jpg`} detail-shown="false" onToggle={this.props.onToggle} onSetItem={this.props.onSetItem}  />
                        <EventItem posterSrc={`../../resource/images/poster_dummy/1.jpg`} detail-shown="false" onToggle={this.props.onToggle} onSetItem={this.props.onSetItem}  />
                        <EventItem posterSrc={`../../resource/images/poster_dummy/1.jpg`} detail-shown="false" onToggle={this.props.onToggle} onSetItem={this.props.onSetItem}  />
                        <EventItem posterSrc={`../../resource/images/poster_dummy/1.jpg`} detail-shown="false" onToggle={this.props.onToggle} onSetItem={this.props.onSetItem}  />
                    </div>
                </article>
                {(this.props.noBg) ? (null) : (<div className="background-overlay-fix"/>) }
            </div>
        );
    }
}

export default SearchResult;
