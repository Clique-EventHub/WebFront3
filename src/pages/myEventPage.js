import React, { Component } from 'react';
import normalPage from '../hoc/normPage';
import pages from '../hoc/pages';
import { Link } from 'react-router';

import CardList from '../components/cardList';
import EventItem from '../container/eventItem';
import EditProfile from '../container/editProfile';

import './css/myEvent.min.css';

class myEventPage extends Component {

    onEditProfile() {
        this.props.set_pop_up_item(<EditProfile />);
        this.props.toggle_pop_item();
    }

    componentWillMount() {
        document.title = "Event Hub | My Event";
    }

    render() {
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
