import React, { Component } from 'react';
import autoBind from '../hoc/autoBind';
import EventItem from '../container/eventItem';
import './css/editEvent.css';

class EditEvent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            'name': '',
            'location': '',
            'date': null
        }
        this.onKeyPressed = this.onKeyPressed.bind(this);
    }

    onKeyPressed() {
        const newState = {
            ...this.state,
            name: this.refs.name.value,
            location: this.refs.location.value,
            date: this.refs.date.value
        };
        this.setState(newState);
    }

    render () {
        return (
            <div className="modal-container">
                <article className="event-edit basic-card-no-glow modal-main mar-v-30 pad-30">
                    <button className="card-exit invisible square-round" role="event-exit" onClick={this.props.toggle_pop_item}>
                        <img src="../../resource/images/X.svg" />
                    </button>
                    <div className="content">
                        <div>
                            <div className="mar-v-10 flex">
                                <input className="flex-order-2 bottom-outline-1 border-focus-blue border-transition" id="name" placeholder="EVENT NAME" ref="name" onChange={this.onKeyPressed} />
                                <label className="flex-order-1" htmlFor="name">EVENT NAME</label>
                            </div>
                            <div className="mar-v-10 flex">
                                <input className="flex-order-2 bottom-outline-1 border-focus-blue border-transition" id="location" placeholder="EVENT LOCATION" ref="location" onChange={this.onKeyPressed} />
                                <label className="flex-order-1" htmlFor="location">EVENT LOCATION</label>
                            </div>
                            <div className="mar-v-10 flex">
                                <input className="flex-order-2 bottom-outline-1 border-focus-blue border-transition" id="date" placeholder="EVENT DATE" ref="date" onChange={this.onKeyPressed} />
                                <label className="flex-order-1" htmlFor="date">EVENT DATE</label>
                            </div>
                        </div>
                        <EventItem onToggle={() => {}} onSetItem={() => {}} noGlow="true" />
                    </div>
                </article>
                <div className="background-overlay"/>
            </div>
        )
    }
}

export default autoBind(EditEvent);
