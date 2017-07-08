import React, { Component } from 'react';
import autoBind from '../hoc/autoBind';
import Circle from '../components/circle';
import axios from 'axios';
import { getCookie } from '../actions/common';

class editProfile extends Component {

    constructor(props) {
        super(props);

        this.state = {
          'isLoading': true
        };

        this.onKeyPressed = this.onKeyPressed.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({updated: nextProps.updated});
    }

    componentWillMount() {
        let config = {
            'headers': {
                'Authorization': ('JWT ' + getCookie('fb_sever_token')),
                'crossDomain': true
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
                'regId': (data.data.regId == null) ? 'undefined' : data.data.regId,
                'faculty': (data.data.faculty == null)? 'Faculty of Engineering': data.data.faculty,
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

    onKeyPressed() {
        const newState = {
            ...this.state,
            'new_birth_day': this.refs.birth.value,
            'new_nick_name': this.refs.nick_name.value,
            'new_lineId': this.refs.line.value,
            'new_email': this.refs.email.value,
            'new_phone': this.refs.mobile.value,
            'new_shirt_size': this.refs.size.value,
            'new_disease': this.refs.med.value,
            'new_allergy': this.refs.food.value,
            'new_dorm_building': this.refs.dorm_building.value,
            'new_dorm_room': this.refs.dorm_room.value,
            'new_dorm_bed': this.refs.dorm_bed.value,
        };
        this.setState(newState);
    }

    save() {
        const newState = {
            ...this.state,
            'birth_day': this.refs.birth.value,
            'nick_name': this.refs.nick_name.value,
            'lineId': this.refs.line.value,
            'email': this.refs.email.value,
            'phone': this.refs.mobile.value,
            'shirt_size': this.refs.size.value,
            'disease': this.refs.med.value,
            'allergy': this.refs.food.value,
            'dorm_building': this.refs.dorm_building.value,
            'dorm_room': this.refs.dorm_room.value,
            'dorm_bed': this.refs.dorm_bed.value,
        };
        this.setState(newState);

        let config = {
            'headers': {
                'Authorization': ('JWT ' + getCookie('fb_sever_token'))
            }
        }

        let responseBody = {
            'birth_day': this.refs.birth.value,
            'nick_name': this.refs.nick_name.value,
            'lineId': this.refs.line.value,
            'email': this.refs.email.value,
            'phone': this.refs.mobile.value,
            'shirt_size': this.refs.size.value,
            'disease': this.refs.med.value,
            'allergy': this.refs.food.value,
            'dorm_building': this.refs.dorm_building.value,
            'dorm_room': this.refs.dorm_room.value,
            'dorm_bed': this.refs.dorm_bed.value,
        }

        axios.put('http://128.199.208.0:1111/user', responseBody, config).then((response) => {
            var msg = response.msg;
            var code = response.code;
            console.log(msg);
            console.log("code = "+code);
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
            'new_birth_day': this.state.birth_day,
            'new_nick_name': this.state.nick_name,
            'new_lineId': this.state.lineId,
            'new_email': this.state.email,
            'new_phone': this.state.phone,
            'new_shirt_size': this.state.shirt_size,
            'new_disease': this.state.disease,
            'new_allergy': this.state.allergy,
            'new_dorm_building': this.state.dorm_building,
            'new_dorm_room': this.state.dorm_room,
            'new_dorm_bed': this.state.dorm_bed,
        };
        this.setState(newState);
        this.props.toggle_pop_item();
    }

    onExit() {
        this.props.toggle_pop_item();
    }

    render() {
        return (
            <div className="modal-container">
                <div className="edit-profile basic-card-no-glow modal-main mar-h-auto mar-v-40">
                    {(this.state.isLoading) ? (<div>Loading...</div>) : (
                      <div>
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
                                <img src="../../resource/icon/icon3.svg" alt="id"/> <p>{this.state.regId}</p>
                                <img src="../../resource/icon/icon6.svg" alt="birth"/> <input ref="birth" type="text" placeholder="Birthdate" value={this.state.new_birth_day} onChange={this.onKeyPressed}/>
                                <img src="../../resource/icon/icon2.svg" alt="nickname"/> <input ref="nick_name" type="text" placeholder="Nickname" value={this.state.new_nick_name} onChange={this.onKeyPressed}/>
                                <img src="../../resource/icon/icon8.svg" alt="line"/> <input ref="line" type="text" placeholder="Line ID" value={this.state.new_lineId} onChange={this.onKeyPressed}/>
                                <img src="../../resource/icon/icon9.svg" alt="email"/> <input ref="email" type="text" placeholder="Email" value={this.state.new_email} onChange={this.onKeyPressed}/>
                                <img src="../../resource/icon/icon10.svg" alt="mobile"/> <input ref="mobile" type="text" placeholder="Mobile Number" value={this.state.new_phone} onChange={this.onKeyPressed}/>
                                <img src="../../resource/icon/icon11.svg" alt="size"/> <input ref="size" type="text" placeholder="T-Shirt Size" value={this.state.new_shirt_size} onChange={this.onKeyPressed}/>
                                <img src="../../resource/icon/icon12.svg" alt="med"/> <input ref="med" type="text" placeholder="Medical Problem" value={this.state.new_disease} onChange={this.onKeyPressed}/>
                                <img src="../../resource/icon/icon13.svg" alt="food"/> <input ref="food" type="text" placeholder="Food Allergy" value={this.state.new_allergy} onChange={this.onKeyPressed}/>
                                <img src="../../resource/icon/icon14.svg" alt="dorm"/>
                                <div className="flex">
                                    <input className="w100" ref="dorm_building" type="text" placeholder="Building" value={this.state.new_dorm_building} onChange={this.onKeyPressed}/>
                                    <input className="w50" ref="dorm_room" type="text" placeholder="Room" value={this.state.new_dorm_room} onChange={this.onKeyPressed}/>
                                    <input className="w50" ref="dorm_bed" type="text" placeholder="Bed" value={this.state.new_dorm_bed} onChange={this.onKeyPressed}/>
                                </div>
                            </section>
                            <p className="sec-line"></p>
                            <section className="edit-pro-right">
                                <div className="fb-link">
                                    <img src="../../resource/icon/icon7.svg" alt="fb-link"/> <p>{this.state.firstName+" "+this.state.lastName}</p>
                                    <button className="unlink">Unlink</button>
                                </div>
                                <div className="cu-link">
                                    <img src="../../resource/icon/icon.svg" alt="cu-link"/> <p>{this.state.regId}</p>
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
                    )}
                </div>
                <div className="background-overlay" />
            </div>
        );
    }
}

export default autoBind(editProfile);
