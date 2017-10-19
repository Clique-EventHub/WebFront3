import React, { Component } from 'react';
import autoBind from '../hoc/autoBind';
import normalPage from '../hoc/normPage';
import pages from '../hoc/pages';
// import { Link } from 'react-router';
import axios from 'axios';
import { getCookie, getChannel } from '../actions/common';
import { hostname } from '../actions/index';
import * as facultyMap from '../actions/facultyMap';
import CardList from '../components/cardList';
import EventItem from '../container/eventItem';
import EditProfile from '../container/editProfile';
import Circle from '../components/circle';
import _ from 'lodash';

import './css/myEvent.css';

class myEventPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
          'firstName': '',
          'lastName': '',
          'picture': '',
          'regId': '',
          'faculty': '99',
          'birth_day': '',
          'nick_name': '',
          'lineId': '',
          'email': '',
          'phone': '',
          'shirt_size': '',
          'disease': '',
          'allergy': '',
          'dorm_building': '',
          'dorm_room': '',
          'dorm_bed': '',
          'join_events': '',
          'interest_events': '',
          'already_joined_events': '',
          'n_join': 0,
          'n_intr': 0,
          'n_completed': '',
          'showJoin': true,
          'isLoading': true,
          'channel_data': {}
        };
    }

    componentWillMount() {
        let config = {
            'headers': {
                'Authorization': ('JWT ' + getCookie('fb_sever_token'))
            }
        }

        axios.get(`${hostname}user`, config).then((data) => {
            _.get(data.data, 'admin_channels', []).forEach((id) => {
              getChannel(id, true).then((dat) => {
                this.setState((prevState) => {
                  let new_data = { ...prevState.channel_data }
                  new_data[id] = dat;
                  return ({
                    ...prevState,
                    'channel_data': new_data
                  });
                })
              })
            })
            this.setState((prevState) => {
                return ({
                  ...prevState,
                  'firstName': data.data.firstName,
                  'lastName': data.data.lastName,
                  'picture': data.data.picture_200px,
                  'regId': (data.data.regId === null) ? 'Not Found' : data.data.regId,
                  'faculty': (data.data.regId === null) ? '99': JSON.stringify(data.data.regId).substring(9, 11),
                  'birth_day': (new Date(data.data.birth_day)).toString().slice(0,15),
                  'nick_name': data.data.nick_name,
                  'lineId': data.data.lineId,
                  'email': data.data.email,
                  'phone': data.data.phone,
                  'shirt_size': data.data.shirt_size,
                  'disease': data.data.disease,
                  'allergy': data.data.allergy,
                  'dorm_building': data.data.dorm_building,
                  'dorm_room': data.data.dorm_room,
                  'dorm_bed': data.data.dorm_bed,
                  'join_events': data.data.join_events,
                  'interest_events': data.data.interest_events,
                  'already_joined_events': data.data.already_joined_events,
                  'n_join': data.data.join_events.length,
                  'n_intr': data.data.interest_events.length,
                  'n_completed': data.data.already_joined_events.length,
                  'showJoin': true,
                });
            })
            // console.log(_.get(this.props, 'user.events.admin.channel', []));
            // _.get(this.props, 'user.info.admin_channels', []).then((id) => {
            //   getChannel(id, false).then((data) => {
            //     console.log(data);
            //   });
            // })
        }, (error) => {
            //console.log("get user error", error);
        });
    }

    onShowJoin() {
        // this.state.events_item = [];
        // for(var i = 0; i < this.state.n_join; i++){
        //     this.state.events_item.push(<EventItem detail-shown="true" onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} />);
        // }
        this.setState({
          ...this.state,
          'showJoin': true
        });
    }

    onShowIntr() {
        // this.state.events_item = [];
        // for(var i = 0; i < this.state.n_intr; i++){
        //     this.state.events_item.push(<EventItem detail-shown="true" onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} />);
        // }
        this.setState({
          ...this.state,
          'showJoin': false
        });
    }

    onChildSave(val) {
        this.setState({
          ...this.state,
          'nick_name': val.nick_name,
          'birth_day': val.birth_day.toString().slice(0,15),
          'shirt_size': val.shirt_size,
          'disease': val.disease,
        });
    }

    onEditProfile() {
        this.props.set_pop_up_item(<EditProfile onSaveItem={(val) => {
                      this.onChildSave.bind(this)(val);
                    }} />);
        this.props.toggle_pop_item();
    }

    render() {
        var i;
        var join_events = [];
        var id_join = 0;
        if(this.state.n_join === 0) {
            join_events.push(<p key={id_join++} className="warn">You don't have any Joined Events.</p>)
        }
        for(i = 0; i < this.state.n_join; i++){
            join_events.push(<EventItem key={id_join++} detail-shown="true" onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} eventId={this.state.join_events[Number(i)]}/>);
        }

        var intr_events = [];
        var id_intr = 0;
        if(this.state.n_intr === 0) {
            intr_events.push(<p key={id_intr++} className="warn">You don't have any Interested Events.</p>)
        }
        for(i = 0; i < this.state.n_intr; i++){
            intr_events.push(<EventItem key={id_intr++} detail-shown="true" onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} eventId={this.state.interest_events[Number(i)]}/>);
        }

        var completed_events = [];
        var id_cp = 0;
        if(this.state.n_completed === 0) {
            completed_events.push(<p key={id_cp++} className="warn">You don't have any Completed Events.</p>)
        }
        for(i = 0; i < this.state.n_completed; i++){
            completed_events.push(<EventItem key={id_cp++} detail-shown="true" onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} eventId={this.state.already_joined_events[Number(i)]} />);
        }

        return (
            <section className="my-event" role="main-content">
                <h1>MY EVENT</h1>
                <section className="profile">
                  <img src={this.state.picture} alt="profile-pic" />
                  <div className="profile-left">
                      <h2 alt="profile-name">{this.state.firstName+" "+this.state.lastName}</h2>
                      <div>
                          <div alt="faculty-icon" className={`bg-${facultyMap.findInfoById(this.state.faculty).ClassNameKeyWord}`} />
                          <p>{facultyMap.findInfoById(this.state.faculty).FullName}</p>
                      </div>
                      <button onClick={this.onEditProfile.bind(this)}>Edit Profile</button>
                  </div>
                  <div className="profile-center">
                      <img src="../../resource/icon/icon2.svg" alt="nickname"/> <p>{this.state.nick_name}</p>
                      <img src="../../resource/icon/icon3.svg" alt="id"/> <p>{this.state.regId}</p>
                      <img src="../../resource/icon/icon6.svg" alt="birth"/> <p>{this.state.birth_day}</p>
                      <img src="../../resource/icon/icon11.svg" alt="size"/> <p>{this.state.shirt_size}</p>
                      <img src="../../resource/icon/icon12.svg" alt="med"/> <p>{this.state.disease}</p>
                  </div>
                  <div className="profile-right">
                      <p>Completed</p>
                      <h1>{this.state.n_completed}</h1>
                  </div>
                </section>
                <p className="line" style={{'position': 'relative'}} />
                <section className="my-event-center">
                    <h2 className={`join-${this.state.showJoin}`} onClick={this.onShowJoin.bind(this)}>Joined Event</h2>
                    <h2 className={`join-${!this.state.showJoin}`} onClick={this.onShowIntr.bind(this)}>Interested Event</h2>
                    <p className={`join-${this.state.showJoin}`}></p>
                    <p className={`join-${!this.state.showJoin} l160`}></p>
                    <hr />
                    <div className="flex" style={{'flexWrap': 'wrap'}}>
                        {(this.state.showJoin) ? join_events : intr_events}
                    </div>
                </section>
                <section className="my-event-buttom">
                    <h2>Completed Event</h2>
                    <hr />
                    <div className="flex" style={{'flexWrap': 'wrap'}}>
                        {completed_events}
                    </div>
                </section>
                <h1>MY CHANNEL</h1>
                <hr />
                {
                  Object.keys(_.get(this.state, 'channel_data', {})).map((id) => {
                    let name = _.get(this.state, `channel_data[${id}].name`, '');
                    let picture = _.get(this.state, `channel_data[${id}].picture`, '');
                    return (<Circle parent="channel" option={{
                      'name': name,
                      'id': id,
                      'picture': picture
                    }} />);
                  })
                }
            </section>
        );
    }
}

{/* <CardList isContain={true} onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} /> */}

export default normalPage(pages(myEventPage, true));
