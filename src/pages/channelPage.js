import React , { Component } from 'react';
import EventItem from '../container/eventItem';
import EditEvent from '../container/editEvent';
import Circle from '../components/circle';
import pages from '../hoc/pages';
import normalPage from '../hoc/normPage';
import axios from 'axios';
import { getCookie } from '../actions/common';
import { hostname } from '../actions/index';
import './css/channelPage.css';

import ChannelDetail from '../container/channelDetail';
import ChannelInfo from '../container/channelInfo';

class channelPage extends Component {

    constructor(props) {
        super(props);
        let _this = this;

        this.state = {
            'isLoading': true,
            'isFollow': false,
        }

        this.onItemPopUpClick = this.onItemPopUpClick.bind(this);
    }

    onClick() {
        let _this = this;

        if(!this.state.isFollow) {
            let config = {
                'headers': {
                    'Authorization': ('JWT ' + getCookie('fb_sever_token'))
                }
            }

            const channel_id = this.props.params.id;

            axios.put(`${hostname}user/subscribe?id=${channel_id}`, config).then((response) => {
                this.setState({
                    ...this.state,
                    'isFollow': true
                });
            }, (error) => {
                //console.log("follow error", error);
            });
        }

    }

    onItemPopUpClick(item) {
        this.props.set_pop_up_item(item);
        this.props.toggle_pop_item();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({updated: nextProps.updated});
    }

    componentWillMount() {
        let _this = this;

        let config = {
            'headers': {
                'Authorization': ('JWT ' + getCookie('fb_sever_token'))
            }
        }

        const channel_id = this.props.params.id;

        axios.get(`${hostname}channel?id=${channel_id}`).then((data) => {
            _this.setState({
                'name': data.data.name,
                'picture': data.data.picture,
                'cover_picture': data.data.picture_large[0],
                'events': data.data.events,
            })
        }, (error) => {
            //console.log("get channel error", error);
        });

        axios.get(`${hostname}user/subscribe`, config).then((data) => {
            if(data.data.hasOwnProperty(_this.state.name)){
                _this.setState({
                    'isFollow': true,
                })
            }
        }, (error) => {
            //console.log("get subscribe error");
        });

    }

    render() {
        //<ChannelDetail onToggle={this.props.toggle_pop_item} />
        const moreInfo = (this.props.isAdmin) ? (
            <div className="cn-detail" onClick={() => {
                    this.onItemPopUpClick(<ChannelInfo onToggle={this.props.toggle_pop_item} />)
                }}>
                <button>EDIT DETAIL</button>
            </div>
        ) : (
            <div className="cn-detail" onClick={() => {
                    this.onItemPopUpClick(<ChannelDetail onToggle={this.props.toggle_pop_item} />)
                }}>
                <button>MORE DETAIL</button>
            </div>
        )
        return (
            <section className="channel-main">
                <button onClick={() => {this.onItemPopUpClick(<EditEvent key="test"/>)}}>Create Event</button>
                <section className="channel-head">
                    <img src={this.state.cover_picture} alt="cn-cover-pic"/>
                    <img src={this.state.picture} alt="cn-profile-pic"/>
                    {moreInfo}
                    <div className="cn-name">
                        <div><h1>{this.state.name}</h1><p>{this.state.detail}</p></div>
                        {(this.state.isFollow) ? (<button className="active" onClick={this.onClick.bind(this)}>FOLLOWING</button>) : (<button onClick={this.onClick.bind(this)}>FOLLOW</button>)}
                    </div>
                </section>
                <section className="cn-event">
                    <section className="cn-top-event">
                        <h1>TOP Event</h1>
                        <p className="hr"></p>
                        <EventItem detail-shown="true" onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} />
                        <EventItem detail-shown="true" onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} />
                    </section>
                    <section className="cn-all-event">
                        <h1>Event of this channel</h1>
                        <p className="hr"></p>
                        <EventItem detail-shown="true" onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} />
                        <EventItem detail-shown="true" onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} />
                        <EventItem detail-shown="true" onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} />
                    </section>
                    <section className="cn-completed-event">
                        <h1>Completed Event</h1>
                        <p className="hr"></p>
                        <EventItem detail-shown="true" onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} />
                        <EventItem detail-shown="true" onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} />
                        <EventItem detail-shown="true" onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} />
                    </section>
                </section>
            </section>
        );
    }
}

channelPage.defaultProps = {
    isAdmin: false
}

export default normalPage(pages(channelPage, true));
