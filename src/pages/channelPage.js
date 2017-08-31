import React , { Component } from 'react';
import EventItem from '../container/eventItem';
import EditEvent from '../container/editEvent';
import Circle from '../components/circle';
import pages from '../hoc/pages';
import normalPage from '../hoc/normPage';
import axios from 'axios';
import { getCookie, getEvent } from '../actions/common';
import { hostname } from '../actions/index';
import './css/channelPage.css';

import ChannelDetail from '../container/channelDetail';
import ChannelInfo from '../container/channelInfo';
import _ from 'lodash';

class channelPage extends Component {

    constructor(props) {
        super(props);
        let _this = this;

        this.state = {
            'isLoading': true,
            'isFollow': false,
            'name': '',
            'picture': '',
            'cover_picture': '',
            'events': [],
            'refObj': {},
            'eventMap': {},
            'eventComplete': []
        }

        this.onItemPopUpClick = this.onItemPopUpClick.bind(this);
    }

    onClick() {
        const channel_id = this.props.params.id;
        const config = {
            'headers': {
                'Authorization': ('JWT ' + getCookie('fb_sever_token'))
            }
        }
        const nextState = !this.state.isFollow;
        const url = `${hostname}user/${(nextState) ? '' : 'un'}subscribe?id=${channel_id}`;

        axios.put(url, {}, config).then((response) => {
            this.setState((prevState) => {
                return ({
                    ...prevState,
                    'isFollow': nextState
                });
            });
        }, (error) => {
            // console.log("follow error", error);
        });

        return nextState;

    }

    onItemPopUpClick(item) {
        this.props.set_pop_up_item(item);
        this.props.toggle_pop_item();
    }

    componentWillMount() {

        let config = {
            'headers': {
                'Authorization': ('JWT ' + getCookie('fb_sever_token'))
            }
        }

        const channel_id = this.props.params.id;

        axios.get(`${hostname}channel?id=${channel_id}`).then((data) => {
            this.setState((prevState) => {
                return ({
                    ...prevState,
                    'name': data.data.name,
                    'picture': data.data.picture,
                    'cover_picture': data.data.picture_large[0],
                    'events': data.data.events,
                    'refObj': data.data
                })
            });

            Promise.all(_.get(data.data, 'events', []).map((id) => {
                return (
                    getEvent(id).then((data) => {
                        this.setState((prevState) => {
                            let new_map = { ...prevState.eventMap };
                            new_map[data._id] = data;
                            const new_event_completed = [ ...prevState.eventComplete ];
                            if(new Date() > new Date(data.date_end)) {
                                new_event_completed.push(data._id);
                            }
                            return ({
                                ...prevState,
                                eventMap: new_map,
                                eventComplete: new_event_completed
                            })
                        })
                        return true;
                    }).catch((e) => e)
                )
            })).then((results) => {
                // console.log(results)
            }).catch((e) => {
                // console.log(e);
            })

        }, (error) => {
            // console.log("get channel error", error);
        });

        axios.get(`${hostname}user/subscribe`, config).then((data) => {
            if(data.data.hasOwnProperty(this.state.name)){
                this.setState((prevState) => {
                    return ({
                        ...prevState,
                        'isFollow': true
                    })
                })
            }
        }, (error) => {

        });

    }

    render() {
        const channel_id = this.props.params.id;
        const isAdmin = _.get(this.props, 'user.events.admin.channel', []).indexOf(channel_id) !== -1;
        const moreInfo = (isAdmin) ? (
            <div className="cn-detail" onClick={() => {
                    this.onItemPopUpClick(<ChannelInfo onToggle={this.props.toggle_pop_item} />)
                }}>
                <button>EDIT DETAIL</button>
            </div>
        ) : (
            <div className="cn-detail" onClick={() => {
                    this.onItemPopUpClick(<ChannelDetail onToggleFollow={this.onClick.bind(this)} isFollow={this.state.isFollow} onToggle={this.props.toggle_pop_item} />)
                }}>
                <button className="Btn-Round">MORE DETAIL</button>
            </div>
        )
        return (
            <section className="channel-main">
                <section className="channel-head">
                    <img src={this.state.cover_picture} alt="cn-cover-pic"/>
                    <img src={this.state.picture} alt="cn-profile-pic"/>
                    {moreInfo}
                    <div className="cn-name">
                        <div><h1>{this.state.name}</h1><p>{this.state.detail}</p></div>
                        {(this.state.isFollow) ? (
                        <button
                            className="active Btn-Round"
                            onClick={this.onClick.bind(this)}
                        >
                                FOLLOWING
                        </button>
                        ) : (
                            <button
                                onClick={this.onClick.bind(this)}
                                className="Btn-Round"
                            >
                                FOLLOW
                            </button>)}
                    </div>
                </section>
                <section className="cn-event">
                    {
                        (isAdmin) ? (
                            [
                                <hr className="thin" key={0} />,
                                <button
                                    className="Btn-Round"
                                    onClick={() => {this.onItemPopUpClick(<EditEvent channelId={this.props.params.id} />)}}
                                    key={1}
                                >Create Event</button>,
                                <hr className="thin" key={3}/>
                            ]
                        ) : null
                    }
                    <section className="cn-top-event">
                        <h1>TOP Event</h1>
                        <p className="hr"></p>
                        <div className="flex-list">
                            {
                                _.get(this.state, 'events', []).filter((item) => this.state.eventComplete.indexOf(item) === -1).map((id, index) => {
                                    return (
                                        <EventItem detail-shown="true" onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} eventId={id} key={index} />
                                    );
                                })
                            }
                        </div>
                    </section>
                    <section className="cn-all-event">
                        <h1>Event of this channel</h1>
                        <p className="hr"></p>
                        <div className="flex-list">
                            {
                                _.get(this.state, 'events', []).map((id, index) => {
                                    return (
                                        <EventItem detail-shown="true" onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} eventId={id} key={index} />
                                    );
                                })
                            }
                        </div>
                    </section>
                    <section className="cn-completed-event">
                        <h1>Completed Event</h1>
                        <p className="hr"></p>
                        <div className="flex-list">
                            {
                                _.get(this.state, 'eventComplete', []).map((id, index) => {
                                    return (
                                        <EventItem detail-shown="true" onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} eventId={id} key={index} />
                                    );
                                })
                            }
                        </div>
                    </section>
                </section>
            </section>
        );
    }
}

export default normalPage(pages(channelPage, true));
