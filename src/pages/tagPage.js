/* eslint-disable */

import './css/tagstyle.css';

import React , { Component } from 'react';

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
                            <div className=" "><h2>TAG NAME</h2></div>
                            <div className="like-button">LIKE</div>
                        </article>
                            <section content="event-list">
                            <EventItem posterSrc={posterTest[4]} detail-shown="true" onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} />
                            <EventItem posterSrc={posterTest[5]} detail-shown="true" onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} />
                            <EventItem posterSrc={posterTest[6]} detail-shown="true" onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} />
                            <EventItem posterSrc={posterTest[7]} detail-shown="true" onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} />
                            <EventItem posterSrc={posterTest[6]} detail-shown="true" onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} />
                            <EventItem posterSrc={posterTest[7]} detail-shown="true" onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} />
                            </section>
                </div>
            </section>
        );
    }
}


export default normalPage(pages(homePage, true));
