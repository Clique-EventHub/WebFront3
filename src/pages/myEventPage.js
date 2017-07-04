import React, { Component } from 'react';
import autoBind from '../hoc/autoBind';
import normalPage from '../hoc/normPage';
import pages from '../hoc/pages';
// import { Link } from 'react-router';
import axios from 'axios';
import { getCookie } from '../actions/common';
import * as facultyMap from '../actions/facultyMap';
import CardList from '../components/cardList';
import EventItem from '../container/eventItem';
import EditProfile from '../container/editProfile';

import './css/myEvent.css';

class myEventPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
          'isLoading': true,
          'faculty': '99'
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({updated: nextProps.updated});
    }

    componentWillMount() {
        let config = {
            'headers': {
                'Authorization': ('JWT ' + getCookie('fb_sever_token'))
            }
        }

        let _this = this;

        axios.get('http://128.199.208.0:1111/user', config).then((data) => {
            console.log("get!!!");
            console.log(JSON.stringify(data.data.firstName));
            _this.setState({
                'firstName': data.data.firstName,
                'lastName': data.data.lastName,
                'picture': data.data.picture_200px,
                'regId': (data.data.regId === null) ? 'undefined' : data.data.regId,
                'faculty': (data.data.regId === null) ? '99': JSON.stringify(data.data.regId).substring(9, 11),
                'birth_day': data.data.birth_day,
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

                'new_birth_day': data.data.birth_day,
                'new_nick_name': data.data.nick_name,
                'new_lineId': data.data.lineId,
                'new_email': data.data.email,
                'new_phone': data.data.phone,
                'new_shirt_size': data.data.shirt_size,
                'new_disease': data.data.disease,
                'new_allergy': data.data.allergy,
                'new_dorm_building': data.data.dorm_building,
                'new_dorm_room': data.data.dorm_room,
                'new_dorm_bed': data.data.dorm_bed,
                'isLoading': false
            })
        }, (error) => {
            console.log("get user error");
        });
    }

    onEditProfile() {
        this.props.set_pop_up_item(<EditProfile />);
        this.props.toggle_pop_item();
    }

    render() {
        return (
            <section role="main-content">
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
                      <img src="../../resource/icon/icon2.svg" alt="nickname"/> <p>{this.state.new_nick_name}</p>
                      <img src="../../resource/icon/icon3.svg" alt="id"/> <p>{this.state.regId}</p>
                      <img src="../../resource/icon/icon6.svg" alt="birth"/> <p>{this.state.new_birth_day}</p>
                      <img src="../../resource/icon/icon11.svg" alt="size"/> <p>{this.state.new_shirt_size}</p>
                      <img src="../../resource/icon/icon12.svg" alt="med"/> <p>{this.state.new_disease}</p>
                  </div>
                  <div className="profile-right">
                      <p>MY point</p>
                      <h1>54</h1>
                  </div>
                </section>
                <p className="line"></p>
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
