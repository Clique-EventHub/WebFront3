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
import { getCookie, getChannel, getTags } from '../actions/common';
import _ from 'lodash';

const demo = false;

class homePage extends Component {

    constructor(props) {
        super(props);
        this.onItemPopUpClick = this.onItemPopUpClick.bind(this);
        // const nonsenseId = Array(3).fill(1).map((x, y) => String(x+y) );
        const demoId = Array(15).fill(1).map(() => "595ef6c7822dbf0014cb821c");
        this.state = {
            'eventHot': demoId.slice(0, 4),
            'eventNew': demoId.slice(0, 4),
            'eventUpcomming': demoId,
            'eventForYou': demoId.slice(0, 4),
            'channelSubscribe': demoId,
            'tagsLike': [],
            'progress': {
                'hot': false,
                'new': false,
                'upcoming': false,
                'forYou': false
            },
            'channelList': {
                'list': [],
                'isLoad': false
            },
            'tags': []
        }
    }

    onItemPopUpClick(item) {
        this.props.set_pop_up_item(item);
        this.props.toggle_pop_item();
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.fb.isLogin && !this.state.channelList.isLoad) {
            const channelIDs = _.get(nextProps, 'user.events.general.subscribe', []);
            Promise.all(channelIDs.map((id) => getChannel(id, false).then((data) => {
                if(this._isMounted) {
                    this.setState((prevState) => {
                        return {
                            ...prevState,
                            channelList: {
                                list: prevState.channelList.list.concat([{
                                    name: data.title,
                                    id: data._id
                                }]),
                                isLoad: prevState.channelList.isLoad
                            }
                        }
                    })
                }
                return true;
            }))).then(() => {
                if (this._isMounted) {
                    this.setState((prevState) => {
                        return ({
                            ...prevState,
                            channelList: {
                                ...prevState.channelList,
                                isLoad: true
                            }
                        })
                    })
                }
            }).catch((e) => {
                if (this._isMounted) {
                    this.setState((prevState) => {
                        return ({
                            ...prevState,
                            channelList: {
                                ...prevState.channelList,
                                isLoad: true
                            }
                        })
                    })
                }
            })
        }
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

        if(!demo) {
            axios.get(`${hostname}event/hot`, config).then((data) => data.data).then((res) => {
                let eventHotId = res.map((item) => {
                    return (
                        item._id
                    );
                })

                if (this._isMounted) {
                    this.setState((prevState, props) => {
                        return ({
                            ...this.state,
                            'eventHot': eventHotId,
                            'progress': {
                                ...this.state.progress,
                                'hot': true
                            }
                        })
                    })
                }
            }).catch((e) => {
                if (this._isMounted) {
                    this.setState((prevState, props) => {
                        return ({
                            ...this.state,
                            'eventHot': [],
                            'progress': {
                                ...this.state.progress,
                                'hot': true
                            }
                        })
                    })
                }
            })

            axios.get(`${hostname}event/new`, config).then((data) => data.data.events).then((res) => {
                if (this._isMounted) {
                    this.setState((prevState, props) => {
                        return ({
                            ...this.state,
                            'eventNew': res.map((item) => item._id).slice(0, 4),
                            'progress': {
                                ...this.state.progress,
                                'new': true
                            }
                        })
                    })
                }
            }).catch(() => {
                if (this._isMounted) {
                    this.setState((prevState, props) => {
                        return ({
                            ...this.state,
                            'eventNew': [],
                            'progress': {
                                ...this.state.progress,
                                'new': true
                            }
                        })
                    })
                }
            })

            axios.get(`${hostname}event/upcoming`, config).then((data) => data.data.events).then(
            (res) => {
                if (this._isMounted) {
                    this.setState((prevState, props) => {
                        return ({
                            ...this.state,
                            'eventUpcomming': res.map((item) => item._id).slice(0, 4),
                            'progress': {
                                ...this.state.progress,
                                'upcoming': true
                            }
                        })
                    })
                }
            }).catch(() => {
                if (this._isMounted) {
                    this.setState((prevState, props) => {
                        return ({
                            ...this.state,
                            'eventUpcomming': [],
                            'progress': {
                                ...this.state.progress,
                                'upcoming': true
                            }
                        })
                    })
                }
            });

            axios.get(`${hostname}event/foryou`, { ...config, ...authConfig }).then((data) => data.data.events).then(
            (res) => {
                if (this._isMounted) {
                    this.setState((prevState, props) => {
                        return ({
                            ...this.state,
                            'eventForYou': res.map((item) => item._id).slice(0, 4),
                            'progress': {
                                ...this.state.progress,
                                'forYou': true
                            }
                        })
                    })
                }
            }).catch(() => {
                if (this._isMounted) {
                    this.setState((prevState, props) => {
                        return ({
                            ...this.state,
                            'eventForYou': [],
                            'progress': {
                                ...this.state.progress,
                                'forYou': true
                            }
                        })
                    })
                }
            })

            getTags().then((tags) => {
                let new_tag = [];
                Object.keys(tags).forEach((key) => {
                    new_tag = new_tag.concat(tags[key]);
                })

                if (this._isMounted) {
                    this.setState((prevState) => {
                        return ({
                            ...prevState,
                            'tags': new_tag
                        })
                    })
                }
            }).catch((e) => {
                if (this._isMounted) {
                    this.setState((prevState) => {
                        return ({
                            ...prevState,
                            'tags': []
                        })
                    })
                }
            })
        }
    }

    componentDidMount() {
        if(!(typeof(this.props.location.query.eid) === "undefined" || this.props.location.query.eid === null)) {
            this.onItemPopUpClick(<EventDetailFix onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} />);
        }
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        //Note: if EventDetail is shown, side-menu should not be pressed -> drastic layout change
        return (
            <section role="main-content">
                <h1 className="display-none">Main body</h1>
                <section role="carousel">
                    <h2 className="display-none">Carousel</h2>
                    <SlickCarousel onItemPopUpClick={this.onItemPopUpClick} onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} isLoad={this.state.progress.hot} eventIds={this.state.eventHot} />
                </section>
                <div className="below-carousel">
                    <section content="upcomming">
                        <h2>Upcoming Events</h2>
                        <CardList eventIds={this.state.eventUpcomming} isLoad={this.state.progress.upcoming} onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} />
                    </section>
                    <section content="bottom-half">
                        <section content="tag">
                            <h2>Tag</h2>
                            <CircleList parent="tag" tags={this.state.tags} />
                        </section>
                        <section content="new">
                            <h2>New</h2>
                            <div style={{'display': 'flex', 'flexWrap': 'wrap', 'justifyContent': 'center'}}>
                                {
                                    this.state.eventNew.concat(["", "", ""]).map((id, index) => {
                                        if (id === "") {
                                            return (
                                                <article key={index} style={{
                                                    'width': 'calc(1.405*300px)',
                                                    'margin': '0px 10px'
                                                }} />
                                            );
                                        }
                                        return (<EventItem key={index} isJoined={_.get(this.props, 'user.events.general.join', []).indexOf(id) !== -1} isLoad={this.state.progress.new} eventId={id} detail-shown="true" onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} />)
                                    })
                                }
                            </div>
                        </section>
                    </section>
                    <section content="bottom-half">
                        <section content="channel">
                            <h2>Channel</h2>
                            <ChannelList channelList={this.state.channelList.list} />
                        </section>
                        <section content="for-you">
                            <h2>For you</h2>
                            <div style={{'display': 'flex', 'flexWrap': 'wrap', 'justifyContent': 'center'}}>
                                {
                                    this.state.eventForYou.concat(["", "", ""]).map((id, index) => {
                                        if (id === "") {
                                            return (
                                                <article key={index} style={{
                                                    'width': 'calc(1.405*300px)',
                                                    'margin': '0px 10px'
                                                }} />
                                            );
                                        }
                                        return (<EventItem key={index} isLoad={this.state.progress.forYou} eventId={id} detail-shown="true" onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} />)
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
