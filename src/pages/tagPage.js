/* eslint-disable */

import './css/tagstyle.css';

import React , { Component } from 'react';
import Axios from 'axios';
import CardList from '../components/cardList';
import ChannelList from '../components/channelList';
import CircleList from '../components/circleList';
import EventItem from '../container/eventItem';
import SlickCarousel from '../components/slickCarousel';
import normalPage from '../hoc/normPage';
import pages from '../hoc/pages';

class homePage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            listOfEvent: [],
            listOfUnDe: []
        };
        let list_event = [], list_event_unde = [];

        Axios.get('http://139.59.97.65:1111/tags/search?keywords=camp').then((data) => {
            console.log("get!!!");
             console.log(JSON.stringify(data.data.events));

            data.data.events.map((event) => {
              if(list_event.length < 6) {
                list_event.push(event._id);
              } else {
                list_event_unde.push(event._id);
              }
            });
            this.setState({
              listOfEvent: list_event,
              listOfUnDe: list_event_unde
            });

        }, (error) => {
            console.log("get event search error");
        });
    }


    onClickMe() {
        // this.props.searched_item_handler(true);
    }


    render() {
        // console.log(this.state.listOfEvent);
        //Note: if EventDetail is shown, side-menu should not be pressed -> drastic layout change
        return (
            <section role="tag-content" onClick={this.onClickMe}>

                <div className="below-carousel">
                        <article className="tag-proflie basic-card">
                            <img className="photo"  />
                            <div className="tag-name"><h2>keyword</h2></div>
                            <div className="like-button">LIKE</div>
                        </article>

                        <section content="event-list">
                            {this.state.listOfEvent.map((ID) => {
                              return <EventItem eventId={ID} detail-shown="true" onToggle={this.props.onToggle} onSetItem={this.props.onSetItem} />
                            })}
                            <br />
                            {this.state.listOfUnDe.map((ID) => {
                              return <EventItem eventId={ID} detail-shown="false" onToggle={this.props.onToggle} onSetItem={this.props.onSetItem} />
                            })}
                        </section>
                </div>


            </section>
        );
    }
}


export default normalPage(pages(homePage, true));
