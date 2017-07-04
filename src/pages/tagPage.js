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
        this.onClickMe = this.onClickMe.bind(this);
        this.onItemPopUpClick = this.onItemPopUpClick.bind(this);
        let _this = this;

        

        this.state = {
            listOfEvent: [],
            listOfUnDe: []
        };
        let list_event = [], list_event_unde = [];

        Axios.get('http://128.199.208.0:1111/tags/search?keyword=music').then((data) => {
            console.log("get!!!");
            // console.log(JSON.stringify(data.data.events));
            
            data.data.events.map((music) => {
              if(list_event.length < 6) {
                list_event.push(event._id);
              } else {
                list_event_unde.push(event._id);
              }
            });
            this.state = {
              listOfEvent: list_event,
              listOfUnDe: list_event_unde
            };

        }, (error) => {
            console.log("get event search error");
        });
    }

    onClickMe() {
        // this.props.searched_item_handler(true);
    }

    onItemPopUpClick(item) {
        if(this.props.pages.pop_up_item === null) this.props.set_pop_up_item(item);
        this.props.toggle_pop_item();
    }

    render() {

        //Note: if EventDetail is shown, side-menu should not be pressed -> drastic layout change

        let posterTest = [];
        for(var i = 1; i < 32; i++) {
            posterTest.push(`../../resource/images/poster_dummy/${i}.jpg`);
        }

        return (
            <section role="tag-content" onClick={this.onClickMe}>


                <div className="below-carousel">
                        <article className="tag-proflie basic-card">
                            <img className="photo"  />
                            <div className=" "><h2>{keyword}</h2></div>
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
