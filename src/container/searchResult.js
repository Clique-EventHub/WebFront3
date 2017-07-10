import React, { Component } from 'react';
import './css/searchResult.css'
import EventItem from '../container/eventItem';
import Axios from 'axios';

class SearchResult extends Component {

    constructor(props) {
      super(props);

      let _this = this;

      this.state = {
        listOfEvent: [],
        listOfUnPic: []
      };
    }

    componentWillReceiveProps(nextProps) {
        let list_tmp = [], list_unpic = [];
        Axios.get('http://139.59.97.65:1111/event/search?keyword=' + this.props.keyword).then((data) => {
            console.log("get!!!");
            // console.log(JSON.stringify(data.data.events));
            data.data.events.map((event) => {
              if(list_tmp.length < 4) {
                list_tmp.push(event._id);
              } else {
                list_unpic.push(event._id);
              }
            });
            this.state = {
              listOfEvent: list_tmp,
              listOfUnPic: list_unpic
            };

        }, (error) => {
            console.log("get event search error");
        });
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
                    <div className="found">found {this.state.listOfEvent.length + this.state.listOfUnPic.length} results</div>
                    <div className="event-found">
                      {this.state.listOfEvent.map((ID) => {
                        return <EventItem eventId={ID} detail-shown="true" onToggle={this.props.onToggle} onSetItem={this.props.onSetItem} />
                      })}

                         <br />
                         {this.state.listOfUnPic.map((ID) => {
                           return <EventItem eventId={ID} detail-shown="false" onToggle={this.props.onToggle} onSetItem={this.props.onSetItem} />
                         })}
                    </div>
                </article>
                {(this.props.noBg) ? (null) : (<div className="background-overlay-fix"/>) }
            </div>
        );
    }
}

export default SearchResult;
