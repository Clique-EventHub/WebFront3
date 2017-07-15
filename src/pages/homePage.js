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
import { getCookie } from '../actions/common';

class homePage extends Component {

    constructor(props) {
        super(props);
        this.onItemPopUpClick = this.onItemPopUpClick.bind(this);
        // const nonsenseId = Array(3).fill(1).map((x, y) => String(x+y) );
        this.state = {
            'eventHot': [],
            'eventNew': [],
            'eventUpcomming': [],
            'eventForYou': [],
            'channelSubscribe': [],
            'tagsLike': []
        }
    }

    onItemPopUpClick(item) {
        this.props.set_pop_up_item(item);
        this.props.toggle_pop_item();
    }

    componentWillMount() {
        document.title = "Event Hub | Home";

        const authConfig = {
            'headers': {
                'Authorization': ('JWT ' + getCookie('fb_sever_token')),
                'crossDomain': true
            }
        }

        const config = {
            'headers': {
                'crossDomain': true
            },
            onDownloadProgress: function (progressEvent) {
                // console.log(progressEvent.target.responseURL);
                // console.log(progressEvent.loaded/progressEvent.total*100);
            },
            onUploadProgress: function (progressEvent) {
                // console.log(progressEvent.target.responseURL);
                // console.log(progressEvent.loaded/progressEvent.total*100);
            }
        }

        axios.get(`${hostname}event/hot`, config).then((data) => data.data).then((res) => {
            let eventHotId = [];
            if(res.first) eventHotId.push(res.first._id);
            if(res.second) eventHotId.push(res.second._id);
            if(res.third) eventHotId.push(res.third._id);

            this.setState((prevState, props) => {
                return ({
                    ...this.state,
                    'eventHot': eventHotId
                })
            })
        })

        axios.get(`${hostname}event/new`, config).then((data) => data.data.events).then((res) => {
            this.setState({
                ...this.state,
                'eventNew': res.map((item) => item._id)
            })
        })

        axios.get(`${hostname}event/upcoming`, config).then((data) => data.data.events).then(
        (res) => {
            this.setState({
                ...this.state,
                'eventUpcomming': res.map((item) => item._id)
            })
        });

        axios.get(`${hostname}event/foryou`, { ...config, ...authConfig }).then((data) => data.data.events).then(
        (res) => {
            this.setState({
                ...this.state,
                'eventForYou': res
            })
        })

    }

    componentDidMount() {
        if(!(typeof(this.props.location.query.eid) === "undefined" || this.props.location.query.eid === null)) {
            this.onItemPopUpClick(<EventDetailFix onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} />);
        }
    }

    render() {

        //Note: if EventDetail is shown, side-menu should not be pressed -> drastic layout change

        return (
            <section role="main-content">
                <h1 className="display-none">Main body</h1>
                <section role="carousel">
                    <h2 className="display-none">Carousel</h2>
                    <SlickCarousel onItemPopUpClick={this.onItemPopUpClick} onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} />
                </section>
                <div className="below-carousel">
                    <section content="upcomming">
                        <h2>Upcomming</h2>
                        <CardList eventIds={this.state.eventUpcomming} onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} />
                    </section>
                    <section content="bottom-half">
                        <section content="tag">
                            <h2>Tag</h2>
                            <CircleList parent="tag" />
                        </section>
                        <section content="new">
                            <h2>New</h2>
                            <div style={{'display': 'flex', 'flexWrap': 'wrap', 'justifyContent': 'center'}}>
                                {
                                    this.state.eventNew.map((id, index) => {
                                        return (<EventItem key={index} eventId={id} detail-shown="true" onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} />)
                                    })
                                }
                            </div>
                        </section>
                    </section>
                    <section content="bottom-half">
                        <section content="channel">
                            <h2>Channel</h2>
                            <ChannelList />
                        </section>
                        <section content="for-you">
                            <h2>For you</h2>
                            <div style={{'display': 'flex', 'flexWrap': 'wrap', 'justifyContent': 'center'}}>
                                {
                                    this.state.eventForYou.map((id, index) => {
                                        return (<EventItem key={index} eventId={id} detail-shown="true" onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} />)
                                    })
                                }
                            </div>
                        </section>
                    </section>
                </div>
            </section>
        );
    }
}

export default normalPage(pages(homePage, true));
