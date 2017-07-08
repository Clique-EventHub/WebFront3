/* eslint-disable */

import React , { Component } from 'react';
import EventItem from '../container/eventItem';
import CardList from '../components/cardList';
import SlickCarousel from '../components/slickCarousel';
import CircleList from '../components/circleList';
import ChannelList from '../components/channelList';

import pages from '../hoc/pages';
import normalPage from '../hoc/normPage';

import EditProfile from '../container/editProfile';
import DatePicker from '../components/datePicker';
import EventDetailFix from '../container/eventDetail2';

import axios from 'axios';
import { hostname } from '../actions/index';

class homePage extends Component {

    constructor(props) {
        super(props);
        this.onClickMe = this.onClickMe.bind(this);
        this.onItemPopUpClick = this.onItemPopUpClick.bind(this);
        this.state = {
            'eventHot': [],
            'eventNew': []
        }
    }

    onClickMe() {
        // this.props.searched_item_handler(true);
    }

    onItemPopUpClick(item) {
        if(this.props.pages.pop_up_item === null) this.props.set_pop_up_item(item);
        this.props.toggle_pop_item();
    }

    componentWillMount() {
        document.title = "Event Hub | Home";
        axios.get(`${hostname}event/hot`).then((data) => data.data).then((res) => {
            let eventHotId = [];
            if(res.first) eventHotId.push(res.first._id);
            if(res.second) eventHotId.push(res.second._id);
            if(res.third) eventHotId/push(res.third._id);

            this.setState({
                ...this.state,
                'eventHot': eventHotId
            })
        })

        axios.get(`${hostname}event/new`).then((data) => data.data.events).then((res) => {
            this.setState({
                ...this.state,
                'eventNew': res.map((item) => item._id)
            })
        })
    }

    componentDidMount() {
        if(!(typeof(this.props.location.query.eid) === "undefined" || this.props.location.query.eid === null)) {
            this.onItemPopUpClick(<EventDetailFix onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} />);
        }
    }

    componentDidUpdate() {
        console.log(this.state);
    }

    render() {

        //Note: if EventDetail is shown, side-menu should not be pressed -> drastic layout change

        let posterTest = [];
        for(var i = 1; i < 32; i++) {
            posterTest.push(`../../resource/images/poster_dummy/${i}.jpg`);
        }

        return (
            <section role="main-content" onClick={this.onClickMe}>
                <h1 className="display-none">Main body</h1>
                <section role="carousel">
                    <h2 className="display-none">Carousel</h2>
                    <SlickCarousel onItemPopUpClick={this.onItemPopUpClick} onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} />
                </section>
                <div className="below-carousel">
                    <section content="upcomming">
                        <h2>Upcomming</h2>
                        <CardList onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} />
                    </section>
                    <section content="bottom-half">
                        <section content="tag">
                            <h2>Tag</h2>
                            <CircleList parent="tag" />
                        </section>
                        <section content="new">
                            <h2>New</h2>
                            {
                                this.state.eventNew.map((id) => {
                                    return (<EventItem eventId={id} detail-shown="true" onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} isJoined={true} />)
                                })
                            }
                        </section>
                    </section>
                    <section content="bottom-half">
                        <section content="channel">
                            <h2>Channel</h2>
                            <ChannelList />
                        </section>
                        <section content="for-you">
                            <h2>For you</h2>
                            <EventItem posterSrc={posterTest[4]} detail-shown="true" onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} />
                            <EventItem posterSrc={posterTest[5]} detail-shown="true" onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} />
                            <EventItem posterSrc={posterTest[6]} detail-shown="true" onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} />
                            <EventItem posterSrc={posterTest[7]} detail-shown="true" onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} />
                        </section>
                    </section>
                </div>
            </section>
        );
    }
}

export default normalPage(pages(homePage, true));
