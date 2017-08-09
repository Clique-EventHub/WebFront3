/* eslint-disable */

import './css/tagstyle.css';

import React , { Component } from 'react';
import axios from 'axios';
import EventItem from '../container/eventItem';
import normalPage from '../hoc/normPage';
import pages from '../hoc/pages';
import { hostname } from '../actions/index';
import { getCookie } from '../actions/common';
import Image from '../components/Image';
import _ from 'lodash';

class tagPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            listOfEvents: [],
            like_state: true
        };
    }

    setLikeState(target, isActive) {
        let isChange = false;
        let isAdd = false;
        if(isActive) {
            if(target.className.indexOf(" active") === -1) {
                target.className = target.className.concat(" active");
                isChange = true;
                isAdd = true;
            }
        } else {
            if(target.className.indexOf(" active") !== -1) {
                target.className = target.className.replace(" active", "");
                isChange = true;
            }
        }

        if(isChange) {
            if(getCookie('fb_sever_token')) {
                let config = {
                    'headers': {
                        'Authorization': ('JWT ' + getCookie('fb_sever_token')),
                        'crossDomain': true
                    }
                }
                axios.get(`${hostname}user`, config).then(
                    (data) => data.data
                ).then((data) => {
                    const keyword = this.props.location.query.keyword || '';
                    const new_tag_like = Array.from(new Set(_.get(data, 'tag_like', [])));

                    if(isAdd) {
                        axios.put(`${hostname}user`, {
                            tag_like: new_tag_like.concat([keyword])
                        }, config)
                    } else {
                        axios.put(`${hostname}user`, {
                            tag_like: new_tag_like.filter((item) => item !== keyword)
                        }, config)
                    }

                })
            }
        }
    }

    componentWillMount() {
        document.title = "Event Hub | Tag";
        const keyword = this.props.location.query.keyword || '';
        if(typeof keyword === "string" && keyword.length > 0) {
            if(keyword.length !== 0) {

                let config = {
                    'headers': {
                        'Authorization': ('JWT ' + getCookie('fb_sever_token')),
                        'crossDomain': true
                    }
                }

                Promise.all([
                    axios.get(`${hostname}user`, config),
                    axios.get(`${hostname}tags/search?keywords=${keyword}`)
                ]).then((datas) => {
                    this.setState((prevState) => {
                        return ({
                            ...prevState,
                            like_state: (_.get(datas[0], 'data.tag_like', []).indexOf(keyword) !== -1),
                            listOfEvents: datas[1].data.events
                        });
                    }, () => {
                        this.setLikeState.bind(this)(this.likeButton, this.state.like_state);
                    });
                })
            }
        }
    }

    render() {
        //Note: if EventDetail is shown, side-menu should not be pressed -> drastic layout change
        const keyword = this.props.location.query.keyword ? this.props.location.query.keyword : 'No keyword';

        return (
            <section role="tag-content">
                <article className="tag-proflie basic-card-no-glow">
                    <div className="tag-info-container">
                        <Image src="" imgClass="photo" rejectClass="photo" />
                        <div className="tag-name"><h2>{keyword}</h2></div>
                        <div ref={(div) => this.likeButton = div} className="like-button" onClick={(e) => {
                                this.setLikeState.bind(this)(e.target, (e.target.className.indexOf(" active") === -1))
                            }}>LIKE</div>
                    </div>
                </article>
                <section content="event-list" className="margin-auto">
                    {
                        this.state.listOfEvents.map((item, index) => {
                            if(index < 6) return <EventItem eventId={item._id} key={index} detail-shown="true" onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} />
                            else if(index === 6) return [<br key="abc"/>, <EventItem key="def" eventId={item._id} detail-shown="false" onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} />]
                            else return <EventItem eventId={item._id} detail-shown="false" onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} />
                        })
                    }
                </section>
            </section>
        );
    }
}

export default normalPage(pages(tagPage, true));
