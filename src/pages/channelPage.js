import React , { Component } from 'react';
import EventItem from '../container/eventItem';
import EditEvent from '../container/editEvent2';
import Circle from '../components/circle';
import pages from '../hoc/pages';
import normalPage from '../hoc/normPage';
import axios from 'axios';
import { getCookie } from '../actions/common';
import './css/channelPage.css';

class channelPage extends Component {

    constructor(props) {
        super(props);
        let _this = this;

        this.state = {
            'channel_id': "5946205a4b908f001403aba5",
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

            axios.put('http://139.59.97.65:1111/user/subscribe?id=' + _this.state.channel_id, config).then((response) => {
                console.log("followed!!!");
                this.setState({
                    ...this.state,
                    'isFollow': true
                });
            }, (error) => {
                console.log("follow error");
                console.log(error.msg);
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

        axios.get('http://139.59.97.65:1111/channel?id=' + _this.state.channel_id).then((data) => {
            console.log("get!!!");
            console.log(JSON.stringify(data.data.name));
            _this.setState({
                'name': data.data.name,
                'picture': data.data.picture,
                'cover_picture': data.data.picture_large[0],
                'events': data.data.events,
            })
        }, (error) => {
            console.log("get channel error");
        });

        axios.get('http://139.59.97.65:1111/user/subscribe', config).then((data) => {
            console.log("get subscribe!!!");

            if(data.data.hasOwnProperty(_this.state.name)){
                console.log("isFollowing");
                _this.setState({
                    'isFollow': true,
                })
            } else {
                console.log("Not follow");
            }
        }, (error) => {
            console.log("get subscribe error");
        });

    }

    render() {

        let posterTest = [];
        for(var i = 1; i < 32; i++) {
            posterTest.push(`../../resource/images/poster_dummy/${i}.jpg`);
        }

        return (
            <section className="channel-main">
                <button onClick={() => {this.onItemPopUpClick(<EditEvent key="test"/>)}}>Create Event</button>
                <section className="channel-head">
                    <div className="cn-tag">
                        <Circle parent="tag" />
                        <Circle parent="tag" />
                    </div>
                    <img src={this.state.cover_picture} alt="cn-cover-pic"/>
                    <img src={this.state.picture} alt="cn-profile-pic"/>
                    <div className="cn-detail">
                        <button>MORE DETAIL</button>
                    </div>
                    <div className="cn-name">
                        <div><h1>{this.state.name}</h1><p>{this.state.detail}</p></div>
                        {(this.state.isFollow) ? (<button className="active" onClick={this.onClick.bind(this)}>FOLLOWING</button>) : (<button onClick={this.onClick.bind(this)}>FOLLOW</button>)}
                    </div>
                </section>
                <section className="cn-event">
                    <section className="cn-top-event">
                        <h1>TOP Event</h1>
                        <p className="hr"></p>
                        <EventItem posterSrc={posterTest[0]} detail-shown="true" onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} />
                        <EventItem posterSrc={posterTest[1]} detail-shown="true" onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} />
                    </section>
                    <section className="cn-all-event">
                        <h1>Event of this channel</h1>
                        <p className="hr"></p>
                        <EventItem posterSrc={posterTest[2]} detail-shown="true" onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} />
                        <EventItem posterSrc={posterTest[3]} detail-shown="true" onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} />
                        <EventItem posterSrc={posterTest[4]} detail-shown="true" onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} />
                    </section>
                    <section className="cn-completed-event">
                        <h1>Completed Event</h1>
                        <p className="hr"></p>
                        <EventItem posterSrc={posterTest[5]} detail-shown="true" onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} />
                        <EventItem posterSrc={posterTest[6]} detail-shown="true" onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} />
                        <EventItem posterSrc={posterTest[7]} detail-shown="true" onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} />
                    </section>
                </section>
            </section>
        );
    }
}


export default normalPage(pages(channelPage, true));
