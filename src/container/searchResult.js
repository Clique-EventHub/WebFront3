import React, { Component } from 'react';
import './css/searchResult.css'
import EventItem from '../container/eventItem';
import Axios from 'axios';
import { hostname } from '../actions/index';

class SearchResult extends Component {

    constructor(props) {
        super(props);

        let _this = this;

        this.state = {
            listOfEvents: []
        };
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.keyword && nextProps.keyword !== '') {
            Axios.get(`${hostname}event/search?keyword=${nextProps.keyword}`).then((data) => {
                this.setState({
                    ...this.state,
                    listOfEvents: data.data.events
                })
            }, (error) => {
                this.setState({
                    ...this.state,
                    listOfEvents: []
                })
            });
        }
    }
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
                    <div className="found">found {this.state.listOfEvents.length} results</div>
                    <div className="event-found">
                      {this.state.listOfEvents.map((item, index) => {
                          const overrideState= {
                                  'title': item.title,
                                  'location': item.location,
                                  'date_time': [new Date(item.date_start), new Date(item.date_end)],
                                  'poster': item.picture
                              }
                          if(index < 4) return <EventItem key={index} eventId={item._id} detail-shown="true" onToggle={this.props.onToggle} onSetItem={this.props.onSetItem} overrideState={overrideState} />
                          else if(index === 4) return [<br key="abc"/>, <EventItem key="def" eventId={item._id} detail-shown="false" onToggle={this.props.onToggle} onSetItem={this.props.onSetItem} overrideState={overrideState} />]
                          return <EventItem key={index} eventId={item._id} detail-shown="false" onToggle={this.props.onToggle} onSetItem={this.props.onSetItem} overrideState={overrideState} />
                      })}
                    </div>
                </article>
                {(this.props.noBg) ? (null) : (<div className="background-overlay-fix"/>) }
            </div>
        );
    }
}

export default SearchResult;
