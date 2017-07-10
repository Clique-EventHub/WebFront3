import React, { Component } from 'react';
import autoBind from '../hoc/autoBind';
import Circle from '../components/circle';
import axios from 'axios';
import { getCookie } from '../actions/common';

class editProfile extends Component {

    constructor(props) {
        super(props);

        let config = {
            'headers': {
                'Authorization': ('JWT ' + getCookie('fb_sever_token'))
            }
        }

        // _id, firstName, lastName, picture, picture_200px, email, gender, shirt_size, phone, regId, facebookId, twitterUsername, lineId, disease, birth_day, allergy,
        // notification, firstNameTH, lastNameTH, major, emer_phone, admin_events, admin_channels, join_events, interest_events, subscribe_channels, already_joined_events,
        // tag_like, dorm_bed, dorm_building, dorm_room
        //
        // nick_name, picture, picture_200px, birth_da, twitterUsername, phone, shirt_size, allergy, disease, emer_phone, tag_like, dorm_room, dorm_building, dorm_bed,
        // twitterUsername, lineId, notification

        let _this = this;

        this.state = {
<<<<<<< HEAD
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
          'tag_like': '',

          'new_birth_day': '',
          'new_nick_name': '',
          'new_lineId': '',
          'new_email': '',
          'new_phone': '',
          'new_shirt_size': '',
          'new_disease': '',
          'new_allergy': '',
          'new_dorm_building': '',
          'new_dorm_room': '',
          'new_dorm_bed': '',
          'new_tag_like': '',
          'isLoading': true
        };
=======

        }

        axios.get('http://128.199.208.0:1111/user', config).then((data) => {
            console.log("get!!!");
            console.log(JSON.stringify(data.data.firstName));
            _this.state = {
                'firstName': data.data.firstName,
                'lastName': data.data.lastName,
                'picture': data.data.picture_200px,

                'regId': data.data.regId,
                'birth_day': data.data.birth_day,
                'nick_name': data.data.nick_name,
                'lineId': data.data.lineId,
                'email': data.data.email,
                'phone': data.data.phone,
                'shirt_size': data.data.shirt_size,
                'disease': data.data.disease,
                'allergy': data.data.allergy,
                
                'new_regId': data.data.regId,
                'new_birth_day': data.data.birth_day,
                'new_nick_name': data.data.nick_name,
                'new_lineId': data.data.lineId,
                'new_email': data.data.email,
                'new_phone': data.data.phone,
                'new_shirt_size': data.data.shirt_size,
                'new_disease': data.data.disease,
                'new_allergy': data.data.allergy,
            }
        }, (error) => {
            console.log("get user error");
        });
>>>>>>> 9c49bcfa2dbad34a172369ac808e9c80cf9b6836

        this.onKeyPressed = this.onKeyPressed.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({updated: nextProps.updated});
    }

    componentDidMount() {
        let config = {
            'headers': {
                'Authorization': ('JWT ' + getCookie('fb_sever_token'))
            }
        }

        let _this = this;

        axios.get('http://128.199.208.0:1111/user', config).then((data) => {
            console.log("get!!!");
            console.log(JSON.stringify(data.data.firstName));
            _this.state = {
                'firstName': data.data.firstName,
                'lastName': data.data.lastName,
                'picture': data.data.picture_200px,
                'regId': data.data.regId,
                'birth_day': data.data.birth_day,
                'nick_name': data.data.nick_name,
                'lineId': data.data.lineId,
                'email': data.data.email,
                'phone': data.data.phone,
                'shirt_size': data.data.shirt_size,
                'disease': data.data.disease,
                'allergy': data.data.allergy,

                'new_regId': data.data.regId,
                'new_birth_day': data.data.birth_day,
                'new_nick_name': data.data.nickname,
                'new_lineId': data.data.lineId,
                'new_email': data.data.email,
                'new_phone': data.data.phone,
                'new_shirt_size': data.data.shirt_size,
                'new_disease': data.data.disease,
                'new_allergy': data.data.allergy,
            }
        }, (error) => {
            console.log("get user error");
        });
    }

    onKeyPressed() {
        const newState = {
            ...this.state,
            'new_regId': this.refs.id.value,
            'new_birth_day': this.refs.birth.value,
            'new_nick_name': this.refs.nickname.value,
            'new_lineId': this.refs.line.value,
            'new_email': this.refs.email.value,
            'new_phone': this.refs.mobile.value,
            'new_shirt_size': this.refs.size.value,
            'new_disease': this.refs.med.value,
            'new_allergy': this.refs.food.value,
        };
        this.setState(newState);
    }

    save() {
        const newState = {
            ...this.state,
            'regId': this.refs.id.value,
            'birth_day': this.refs.birth.value,
            'nick_name': this.refs.nickname.value,
            'lineId': this.refs.line.value,
            'email': this.refs.email.value,
            'phone': this.refs.mobile.value,
            'shirt_size': this.refs.size.value,
            'disease': this.refs.med.value,
            'allergy': this.refs.food.value,
        };
        this.setState(newState);

        let config = {
            'headers': {
                'Authorization': ('JWT ' + getCookie('fb_sever_token'))
            }
        }

        let responseBody = {
            'regId': this.refs.id.value,
            'birth_day': this.refs.birth.value,
            'nick_name': this.refs.nickname.value,
            'lineId': this.refs.line.value,
            'email': this.refs.email.value,
            'phone': this.refs.mobile.value,
            'shirt_size': this.refs.size.value,
            'disease': this.refs.med.value,
            'allergy': this.refs.food.value,
        }

        axios.put('http://128.199.208.0:1111/user', responseBody, config).then((response) => {
            console.log("saved!!!");
            return true;
        }, (error) => {
            console.log("save error");
            return false;
        })

        this.props.toggle_pop_item();
    }

    cancel() {
        const newState = {
            ...this.state,
            'new_regId': this.state.regId,
            'new_birth_day': this.state.birth_day,
            'new_nick_name': this.state.nick_name,
            'new_lineId': this.state.lineId,
            'new_email': this.state.email,
            'new_phone': this.state.phone,
            'new_shirt_size': this.state.shirt_size,
            'new_disease': this.state.disease,
            'new_allergy': this.state.allergy,
        };
        this.setState(newState);
        this.props.toggle_pop_item();
    }

    onExit() {
        this.props.toggle_pop_item();
    }

    render() {
        if(true) {return (
            <div className="modal-container">
                <div className="edit-profile basic-card-no-glow modal-main mar-h-auto mar-v-40">
                    <section className="edit-pro-head">
                        <button role="exit" onClick={this.cancel.bind(this)}>
                            <img src="../../resource/images/X.svg" />
                        </button>
                        <img src={this.state.picture} alt="profile-pic" />
                        <div className="profile-head">
                            <h1 alt="profile-name">{this.state.firstName+" "+this.state.lastName}</h1>
                            <div alt="faculty-icon" /> <p>Faculty of Engineering</p>
                        </div>
                    </section>
                    <p className="hr"></p>
                    <div className="flex">
                        <section className="edit-pro-left">
                            <img alt="id"/> <input ref="id" type="text" placeholder="Student ID" value={this.state.new_regId} onChange={this.onKeyPressed}/>
                            <img alt="birth"/> <input ref="birth" type="text" placeholder="Birthdate" value={this.state.new_birth_day} onChange={this.onKeyPressed}/>
                            <img alt="nickname"/> <input ref="nickname" type="text" placeholder="Nickname" value={this.state.new_nick_name} onChange={this.onKeyPressed}/>
                            <img alt="line"/> <input ref="line" type="text" placeholder="Line ID" value={this.state.new_lineId} onChange={this.onKeyPressed}/>
                            <img alt="email"/> <input ref="email" type="text" placeholder="Email" value={this.state.new_email} onChange={this.onKeyPressed}/>
                            <img alt="mobile"/> <input ref="mobile" type="text" placeholder="Mobile Number" value={this.state.new_phone} onChange={this.onKeyPressed}/>
                            <img alt="size"/> <input ref="size" type="text" placeholder="T-Shirt Size" value={this.state.new_shirt_size} onChange={this.onKeyPressed}/>
                            <img alt="med"/> <input ref="med" type="text" placeholder="Medical Problem" value={this.state.new_disease} onChange={this.onKeyPressed}/>
                            <img alt="food"/> <input ref="food" type="text" placeholder="Food Allergy" value={this.state.new_allergy} onChange={this.onKeyPressed}/>
                        </section>
                        <p className="sec-line"></p>
                        <section className="edit-pro-right">
                            <div className="fb-link">
                                <img alt="fb-link"/> <p>{this.state.firstName+" "+this.state.lastName}</p>
                                <button className="unlink">Unlink</button>
                            </div>
                            <div className="cu-link">
                                <img alt="cu-link"/> <p>{this.state.regId}</p>
                                <button className="unlink">Unlink</button>
                            </div>
                            <div className="my-tag">
                                <p>YOUR INTERESTED TAG</p>
                                <section>
                                    <Circle parent="tag" />
                                    <Circle parent="tag" />
                                    <Circle parent="tag" />
                                    <Circle parent="tag" />
                                    <Circle parent="tag" />
                                    <Circle parent="tag" />
                                    <Circle parent="tag" />
                                </section>
                                <div><button>EDIT</button></div>
                            </div>
                            <div className="btn-plane">
                                <button className="cancel" onClick={this.cancel.bind(this)}>CANCEL</button>
                                <button className="save" onClick={this.save.bind(this)}>SAVE</button>
                            </div>
                        </section>
                    </div>
                </div>
                <div className="background-overlay" />
            </div>
        );}
    }
}

export default autoBind(editProfile);
