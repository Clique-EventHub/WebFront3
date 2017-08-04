/* eslint-disable */

import './css/tagstyle.css';

import React , { Component } from 'react';
import Axios from 'axios';
import EventItem from '../container/eventItem';
import normalPage from '../hoc/normPage';
import pages from '../hoc/pages';
import { hostname } from '../actions/index';

class tagPage extends Component {

    constructor(props) {
        super(props);

        const keyword = this.props.location.query.keyword || '';

        this.state = {
            listOfEvents: []
        };
    }

    componentWillReceiveProps(nextProps) {
        const keyword = nextProps.location.query.keyword || '';
        if(typeof keyword === "string" && keyword.length > 0) {
            if(keyword.length !== 0) {
                Axios.get(`${hostname}tags/search?keywords=${keyword}`).then((data) => {
                    this.setState({
                        ...this.state,
                        listOfEvents: data.data.events
                    });
                }, (error) => {
                    console.log("get event search error");
                });
            }
        }
    }

    componentWillMount() {
        document.title = "Event Hub | Tag";
    }

    render() {
        // console.log(this.state.listOfEvent);
        //Note: if EventDetail is shown, side-menu should not be pressed -> drastic layout change
        const keyword = this.props.location.query.keyword ? this.props.location.query.keyword : 'No keyword';

        return (
            <section role="tag-content">
                <article className="tag-proflie basic-card">
                    <img className="photo" />
                    <div className="tag-name"><h2>{keyword}</h2></div>
                    <div className="like-button">LIKE</div>
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
