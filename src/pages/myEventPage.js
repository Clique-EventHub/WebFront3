import React, { Component } from 'react';
<<<<<<< HEAD
// import autoBind from '../hoc/autoBind';
import normalPage from '../hoc/normPage';
import pages from '../hoc/pages';
// import { Link } from 'react-router';
import axios from 'axios';
import { getCookie } from '../actions/common';
import * as facultyMap from '../actions/facultyMap';
// import CardList from '../components/cardList';
=======
import normalPage from '../hoc/normPage';
import pages from '../hoc/pages';
import { Link } from 'react-router';

import CardList from '../components/cardList';
>>>>>>> 9c49bcfa2dbad34a172369ac808e9c80cf9b6836
import EventItem from '../container/eventItem';
import EditProfile from '../container/editProfile';

import './css/myEvent.min.css';

class myEventPage extends Component {

    onEditProfile() {
        this.props.set_pop_up_item(<EditProfile />);
        this.props.toggle_pop_item();
    }

    render() {
<<<<<<< HEAD
        var i;
        var join_events = [];
        var index_join = 0;
        if(this.state.n_join === 0) {
            join_events.push(<p key={index_join++} className="warn">You don't have any Joined Events.</p>)
        }
        for(i = 0; i < this.state.n_join; i++){
            join_events.push(<EventItem key={index_join++} detail-shown="true" onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} />);
        }

        var intr_events = [];
        var index_intr = 0;
        if(this.state.n_intr === 0) {
            intr_events.push(<p key={index_intr++} className="warn">You don't have any Interested Events.</p>)
        }
        for(i = 0; i < this.state.n_intr; i++){
            intr_events.push(<EventItem key={index_intr++} detail-shown="true" onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} />);
        }

        var completed_events = [];
        var index_cp = 0;
        if(this.state.n_completed === 0) {
            completed_events.push(<p key={index_cp++} className="warn">You don't have any Completed Events.</p>)
        }
        for(i = 0; i < this.state.n_completed; i++){
            completed_events.push(<EventItem key={index_cp++} detail-shown="true" onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} />);
        }

=======
>>>>>>> 9c49bcfa2dbad34a172369ac808e9c80cf9b6836
        return (
            <section role="main-content" >
                <h1>MY EVENT</h1>
                <section data-role="profile">
                    <img alt="pf" />
                    Profile Name
                    <button onClick={this.onEditProfile.bind(this)}>Edit Profile</button>
                </section>
                <h2>My Event</h2>
                <hr />
                <section className="text-center">
                    <EventItem detail-shown="true" onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} />
                    <EventItem detail-shown="true" onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} />
                    <EventItem detail-shown="true" onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} />
                    <EventItem detail-shown="true" onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} />
                    <EventItem detail-shown="true" onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} />
                    <EventItem detail-shown="true" onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} />
                </section>
                <h2>Completed Event</h2>
                <hr />
                <CardList isContain={true} onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} />
            </section>
        );
    }
}

export default normalPage(pages(myEventPage));
