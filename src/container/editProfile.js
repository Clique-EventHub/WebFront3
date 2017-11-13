import React, { Component } from 'react';
import autoBind from '../hoc/autoBind';
import Circle from '../components/circle';
import axios from 'axios';
import { getCookie } from '../actions/common';
import './css/editProfile.css';
import * as facultyMap from '../actions/facultyMap';
let useCls = " toggle-vis";
import { hostname } from '../actions/index';
import ReactLoading from 'react-loading';
import MsgFeedBack from '../components/MsgFeedback';

// class BirthDayText extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             'day': '',
//             'month': '',
//             'year': ''
//         }
//         this.onKeyPress = this.onKeyPress.bind(this);
//     }
//
//     onKeyPress(event, modifiers) {
//         const keyCode = event.keyCode || event.which;
//         const keyValue = String.fromCharCode(keyCode);
//         if(this._isMounted) {
//             console.log(event.target.value);
//             this.setState((prevState) => {
//                 let new_state = { ...prevState };
//                 new_state[modifiers] = event.target.value;
//                 return (new_state)
//             })
//         }
//     }
//
//     componentDidMount() {
//         this._isMounted = true;
//     }
//
//     componentWillUnmount() {
//         this._isMounted = false;
//     }
//
//     render() {
//         return (
//             <div style={{
//                     'display': 'flex',
//                     'alignItems': 'baseline'
//                 }}>
//                 <input
//                     placeholder="DD"
//                     ref={(day) => {if(typeof this.props.refD === "function") return this.props.refD(day)}}
//                     style={{
//                             'flex': '1 1',
//                             'textAlign': 'center'
//                         }}
//                     maxLength="2"
//                     type="text"
//                     onKeyPress={(e) => this.onKeyPress(e, "day")}
//                     value={this.state.day}
//                 />
//                 <span>/</span>
//                 <input
//                     placeholder="MM"
//                     ref={(month) => {if(typeof this.props.refM === "function") return this.props.refM(month)}}
//                     style={{
//                             'flex': '1 1',
//                             'marginLeft': '0px',
//                             'textAlign': 'center'
//                         }}
//                     maxLength="2"
//                     type="text"
//                     onKeyPress={(e) => this.onKeyPress(e, "month")}
//                     value={this.state.month}
//                 />
//                 <span>/</span>
//                 <input
//                     placeholder="YYYY"
//                     ref={(year) => {if(typeof this.props.refY === "function") return this.props.refY(year)}}
//                     style={{
//                             'flex': '1 1',
//                             'marginLeft': '0px',
//                             'textAlign': 'center'
//                         }}
//                     maxLength="4"
//                     type="text"
//                     onKeyPress={(e) => this.onKeyPress(e, "year")}
//                     value={this.state.year}
//                 />
//             </div>
//         );
//     }
// }

// class InputReg extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             'message': ''
//         }
// 		this.onSent = this.onSent.bind(this);
//     }
//
//     onSent() {
//         const config = {
//             'headers': {
//                 'Authorization': ('JWT ' + getCookie('fb_sever_token'))
//             }
//         }
//         axios.put(`${hostname}user/reg`, {
//             'username': this.reg_id.value,
//             'password': this.reg_password.value
//         }, config).then((data) => {
//             this.setState((prevState) => {
//                 return ({
//                     ...prevState,
//                     message: 'Success'
//                 });
//             })
//             this.reg_id.value = '';
//             this.reg_password.value = '';
//         }).catch((e) => {
//             this.setState((prevState) => {
//                 if(e.response && e.response.status) {
//                     return ({
//                         ...prevState,
//                         message: `Error happened with code ${e.response.data}`
//                     });
//                 }
//                 return ({
//                     ...prevState,
//                     message: 'Error happened'
//                 })
//             })
//         })
//     }
//
//     render() {
//         return (
//             <div>
//                 <input placeholder="REG ID" type="text" ref={(input) => this.reg_id = input} />
//                 <input placeholder="PASSWORD" type="password" ref={(input) => this.reg_password = input} />
//                 <button onClick={this.onSent} >Submit</button>
//                 {
//                     (this.state.message.length > 0) ? (
//                         <span>{this.state.message}</span>
//                     ) : null
//                 }
//             </div>
//         );
//     }
// }

function isEmpty(s){
    return s === null || s === "";
}

class editProfile extends Component {

    constructor(props) {
        super(props);

        this.state = {
          'firstName': '',
          'lastName': '',
          'picture': '',
          'regId': 'Not Linked',
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
          'tag_like': [],

          'new_birth_day': '',
          'new_bd_day': '',
          'new_bd_month': '',
          'new_bd_year': '',
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
          'new_tag_like': [],
          'isLoading': true,
          'message': '',
          'reg_id': '',
          'reg_password': '',
          'Feedback': {
              'isShow': false,
              'isError': false,
              'Children': <div />
          }
        };

        this.onKeyPressed = this.onKeyPressed.bind(this);
        this.onShowFeedback = this.onShowFeedback.bind(this);
        this.onExitFeedback = this.onExitFeedback.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({updated: nextProps.updated});
    }

    onShowFeedback(MsgText, isError) {
        this.setState((prevState) => {
            return ({
                ...prevState,
                'Feedback': {
                    ...prevState.Feedback,
                    'isShow': true,
                    'isError': isError,
                    'Children': (
                        <span>
                            {MsgText}
                        </span>
                    ),
                    'Error': {
                        'Msg': 'Oh! Ow! Something is wrong',
                        'Detail': ''
                    }
                }
            });
        })
    }

    onExitFeedback() {
        this.setState((prevState) => {
            return ({
                ...prevState,
                'Feedback': {
                    ...prevState.Feedback,
                    'isShow': false
                }
            });
        }, this.props.toggle_pop_item)
    }

    componentWillMount() {
        let config = {
            'headers': {
                'Authorization': ('JWT ' + getCookie('fb_sever_token')),
                'crossDomain': true
            }
        }

        let _this = this;

        axios.get(`${hostname}user`, config).then((data) => {
            _this.setState({
                ..._this.state,
                'firstName': data.data.firstName,
                'lastName': data.data.lastName,
                'picture': data.data.picture_200px,
                'regId': isEmpty(data.data.regId) ? 'Not Found' : data.data.regId,
                'faculty': isEmpty(data.data.regId) ? '99': JSON.stringify(data.data.regId).substring(9, 11),
                'birth_day' : data.data.birth_day,
                'nick_name' : data.data.nick_name,
                'lineId': data.data.lineId,
                'email': data.data.email,
                'phone': data.data.phone,
                'shirt_size' : data.data.shirt_size,
                'disease' : data.data.disease,
                'allergy': data.data.allergy,
                'dorm_building': data.data.dorm_building,
                'dorm_room': data.data.dorm_room,
                'dorm_bed': data.data.dorm_bed,
                'tag_like': data.data.tag_like,

                'new_birth_day': isEmpty(data.data.birth_day) ? "" : (new Date(data.data.birth_day)).toString().slice(0,15),
                'new_bd_day': isEmpty(data.data.birth_day) ? "" : (new Date(data.data.birth_day)).getDate(),
                'new_bd_month': isEmpty(data.data.birth_day) ? "" : (new Date(data.data.birth_day)).getMonth()+1,
                'new_bd_year': isEmpty(data.data.birth_day) ? "" : (new Date(data.data.birth_day)).getFullYear(),
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
                'new_tag_like': data.data.tag_like,
                'isLoading': false
            })
        }, (error) => {
            //console.log("get user error");
        });
    }

    onKeyPressed() {
        const newState = {
            ...this.state,
            'new_birth_day': (isEmpty(this.refs.bd_year.value) || isEmpty(this.refs.bd_month.value) || isEmpty(this.refs.bd_day.value)) 
                ? "" : new Date(this.refs.bd_year.value,this.refs.bd_month.value-1,this.refs.bd_day.value),
            'new_bd_day': this.refs.bd_day.value,
            'new_bd_month': this.refs.bd_month.value,
            'new_bd_year': this.refs.bd_year.value,
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
            'reg_id': this.refs.reg_id.value,
            'reg_password': this.refs.reg_password.value
            // 'new_tag_like': data.data.tag_like,
        };
        this.setState(newState);
    }

    save() {
        // const newState = {
            // ...this.state,
            // 'birth_day': (isEmpty(this.refs.bd_year) || isEmpty(this.refs.bd_month) || isEmpty(this.refs.bd_day))
                //  ? "BIRTHDAY NOT FOUND" : new Date(this.refs.bd_year.value,this.refs.bd_month.value-1,this.refs.bd_day.value),
            // 'nick_name': isEmpty(this.refs.nick_name.value) ? "NICKNAME NOT FOUND"  : this.refs.nick_name.value,
            // 'lineId': this.refs.line.value,
            // 'email': this.refs.email.value,
            // 'phone': this.refs.mobile.value,
            // 'shirt_size': isEmpty(this.refs.size.value) ? "SHIRT SIZE NOT FOUND" : this.refs.size.value,
            // 'disease': isEmpty(this.refs.med.value) ? "DISEASE NOT FOUND" : this.refs.disease.value,
            // 'allergy': this.refs.food.value,
            // 'dorm_building': this.refs.dorm_building.value,
            // 'dorm_room': this.refs.dorm_room.value,
            // 'dorm_bed': this.refs.dorm_bed.value,
            // 'tag_like': 'new_tag_like',
        // };

        const newState = {
            ...this.state,
            'birth_day': (isEmpty(this.refs.bd_year.value) || isEmpty(this.refs.bd_month.value) || isEmpty(this.refs.bd_day.value)) 
                ? "" : new Date(this.refs.bd_year.value,this.refs.bd_month.value-1,this.refs.bd_day.value),
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
            'tag_like': 'new_tag_like',
        };
        this.setState(newState);

        let config = {
            'headers': {
                'Authorization': ('JWT ' + getCookie('fb_sever_token'))
            }
        }

        axios.put(`${hostname}user`, newState, config).then((response) => {
            var msg = response.msg;
            var code = response.code;
            return true;
        }, (error) => {
            return false;
        })

        if(typeof(this.props.onSaveItem) === "function") {
            this.props.onSaveItem(newState);
        }

        this.onShowFeedback("Updated Profile Complete!", false);
    }

    cancel() {
        const newState = {
            ...this.state,
            'new_birth_day': this.state.birth_day,
            'new_bd_day': isEmpty(this.state.birth_day) ? "" : (new Date(this.state.birth_day)).getDate(),
            'new_bd_month': isEmpty(this.state.birth_day) ? "" : (new Date(this.state.birth_day)).getMonth()+1,
            'new_bd_year': isEmpty(this.state.birth_day) ? "" : (new Date(this.state.birth_day)).getFullYear(),
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
            'new_tag_like': this.state.tags_like,
        };
        this.setState(newState);
        this.props.toggle_pop_item();
    }

    onLoginReg() {
        this.setState({
            ...this.state,
            'message': ''
        })

        const config = {
            'headers': {
                'Authorization': ('JWT ' + getCookie('fb_sever_token'))
            }
        }
        axios.put(`${hostname}user/reg`, {
            'username': this.refs.reg_id.value,
            'password': this.refs.reg_password.value
        }, config).then((data) => {
            this.setState((prevState) => {
                return ({
                    ...prevState,
                    message: 'Success'
                });
            })
            this.state.reg_id.value = '';
            this.state.reg_password.value = '';
        }).catch((e) => {
            // console.log(e);
            this.setState((prevState) => {
                if(e.response && e.response.status) {
                    return ({
                        ...prevState,
                        message: `Invalid username/password`
                    });
                }
                return ({
                    ...prevState,
                    message: 'Error happened'
                })
            })
        })
    }

    onSaveTag() {

    }

    onExit() {
        this.props.toggle_pop_item();
    }

    render() {
        return (
            <div className="modal-container">
                <div className="edit-profile basic-card-no-glow modal-main mar-h-auto mar-v-40">
                    {(this.state.isLoading) ? (
                        <div className="flex flex-center" style={{
                            'margin': '60px 0px 10px 0px'
                        }}>
                            <button role="exit" onClick={this.cancel.bind(this)}>
                                <img src="../../resource/images/X.svg" />
                            </button>
                            <ReactLoading type={'bars'} color={'#878787'} height='40px' width='40px' /> Loading...<ReactLoading type={'bars'} color={'#878787'} height='40px' width='40px' />
                        </div>) : (
                      <div>
                        <section className="edit-pro-head">
                            <button role="exit" onClick={this.cancel.bind(this)}>
                                <img src="../../resource/images/X.svg" />
                            </button>
                            <img src={this.state.picture} alt="profile-pic" />
                            <div className="profile-head">
                                <h1 alt="profile-name">{this.state.firstName+" "+this.state.lastName}</h1>
                                <div alt="faculty-icon" className={`bg-${facultyMap.findInfoById(this.state.faculty).ClassNameKeyWord}`} />
                                <p>{facultyMap.findInfoById(this.state.faculty).FullName}</p>
                            </div>
                        </section>
                        <p className="hr"></p>
                        <div className="flex flex-sp">
                            <section className="edit-pro-left">
                                <img src="../../resource/icon/icon3.svg" alt="id"/> <p>{this.state.regId}</p>
                                <img src="../../resource/icon/icon6.svg" alt="birth"/>
                                <div className="flex">
                                    <input className="w45" ref="bd_day" type="text" placeholder="dd" value={this.state.new_bd_day} onChange={this.onKeyPressed}/>
                                    <input className="w45 m10" ref="bd_month" type="text" placeholder="mm" value={this.state.new_bd_month} onChange={this.onKeyPressed}/> 
                                    <input className="w110 m10" ref="bd_year" type="text" placeholder="yyyy (CE)" value={this.state.new_bd_year} onChange={this.onKeyPressed}/>
                                </div>
                                <img src="../../resource/icon/icon2.svg" alt="nickname"/> <input ref="nick_name" type="text" placeholder="Nickname" value={this.state.new_nick_name} onChange={this.onKeyPressed}/>
                                <img src="../../resource/icon/icon8.svg" alt="line"/> <input ref="line" type="text" placeholder="Line ID" value={this.state.new_lineId} onChange={this.onKeyPressed}/>
                                <img src="../../resource/icon/icon9.svg" alt="email"/> <input ref="email" type="text" placeholder="Email" value={this.state.new_email} onChange={this.onKeyPressed}/>
                                <img src="../../resource/icon/icon10.svg" alt="mobile"/> <input ref="mobile" type="text" placeholder="Mobile Number" value={this.state.new_phone} onChange={this.onKeyPressed}/>
                                <img src="../../resource/icon/icon11.svg" alt="size"/> <input ref="size" type="text" placeholder="T-Shirt Size" value={this.state.new_shirt_size} onChange={this.onKeyPressed}/>
                                <img src="../../resource/icon/icon12.svg" alt="med"/> <input ref="med" type="text" placeholder="Medical Problem" value={this.state.new_disease} onChange={this.onKeyPressed}/>
                                <img src="../../resource/icon/icon13.svg" alt="food"/> <input ref="food" type="text" placeholder="Food Allergy" value={this.state.new_allergy} onChange={this.onKeyPressed}/>
                                <img src="../../resource/icon/icon14.svg" alt="dorm"/> <input ref="dorm_building" type="text" placeholder="Dorm Bd." value={this.state.new_dorm_building} onChange={this.onKeyPressed}/>
                                <div className="flex m40">
                                    <input className="whalf" ref="dorm_room" type="text" placeholder="Room" value={this.state.new_dorm_room} onChange={this.onKeyPressed}/>
                                    <input className="whalf" ref="dorm_bed" type="text" placeholder="Bed" value={this.state.new_dorm_bed} onChange={this.onKeyPressed}/>
                                </div>
                            </section>
                            <p className="sec-line"></p>
                            <section className="edit-pro-right">
                                <div className="fb-link">
                                    <img src="../../resource/icon/icon7.svg" alt="fb-link"/> <p>{this.state.firstName+" "+this.state.lastName}</p>
                                </div>
                                    {(this.state.regId === 'Not Found') ? (
                                      <div className="cu-link">
                                      <img className="mt" src="../../resource/icon/icon.svg" alt="cu-link"/>
                                        <div className="regCU">
                                            <div>
                                              <input placeholder="REG ID" type="text" ref="reg_id" value={this.state.reg_id} onChange={this.onKeyPressed}/>
                                              <input placeholder="PASSWORD" type="password" ref="reg_password" value={this.state.reg_password} onChange={this.onKeyPressed}/>
                                            </div>
                                            <button className="unlink" onClick={this.onLoginReg.bind(this)}>Link to Reg Chula</button>
                                            {
                                                (this.state.message.length > 0) ? (
                                                    <p>{this.state.message}</p>
                                                ) : null
                                            }
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="cu-link">
                                      <img src="../../resource/icon/icon.svg" alt="cu-link" />
                                      <p>{this.state.regId}</p>
                                    </div>)}
                                <div className="my-tag">
                                    <p>YOUR INTERESTED TAG</p>
                                    <section>
                                        <Circle parent="tag" tagName="test" />
                                        <Circle parent="tag" tagName="test" />
                                        <Circle parent="tag" tagName="test" />
                                        <Circle parent="tag" tagName="test" />
                                        <Circle parent="tag" tagName="test" />
                                        <Circle parent="tag" tagName="test" />
                                        <Circle parent="tag" tagName="test" />
                                        <Circle parent="tag" tagName="test" />
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
                <div className="background-overlay" onClick={this.props.onToggle} />
                <MsgFeedBack
                    isShow={this.state.Feedback.isShow}
                    onExit={this.onExitFeedback}
                    children={this.state.Feedback.Children}
                    isError={this.state.Feedback.isError}
                />
            </div>
        );
    }
}

export default autoBind(editProfile);
