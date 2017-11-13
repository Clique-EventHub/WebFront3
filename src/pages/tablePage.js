import React , { Component } from 'react';
import pages from '../hoc/pages';
import normalPage from '../hoc/normPage';
import './css/tablePage.css';
import axios from 'axios';
import { hostname } from '../actions/index';
import { getRandomShade, getCookie, getEvent, ServerToClientFields, getUserIdInfo } from '../actions/common';
import ErrorPopUp from '../components/ErrorPopUp';
import ReactLoading from 'react-loading';
import _ from 'lodash';
import Table from '../components/Table';
import MsgPopUp from '../components/MsgPopUp';

//TODO: Switch to Message PopUp

class tablePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            'fields': [],
            'isLoad': false,
            'peopleData': [],
            'questions': [],
            'responses': []
        }
        this.onGetStat = this.onGetStat.bind(this);
        this.onGetStat();
        this.onPopUpMsg = this.onPopUpMsg.bind(this);
        this.onPopUpError = this.onPopUpError.bind(this);
        this.onSentAccepted = this.onSentAccepted.bind(this);
        this.onSentCheckIn = this.onSentCheckIn.bind(this);
        this.onMessageSent = this.onMessageSent.bind(this);
        this.onErrorMsg = this.onErrorMsg.bind(this);

        // getEvent(this.props.location.query.eid).then(() => {
        //     setTimeout(() => {
        //         if (this._isMounted) {
        //             this.setState((prevState) => {
        //                 return ({
        //                     ...prevState,
        //                     'isLoad': true
        //                 });
        //             })
        //         }
        //     }, 1500);
        // });
    }

    onGetStat(eventId) {

        const config = {
            'headers': {
                'Authorization': ('JWT ' + getCookie('fb_sever_token')),
                'crossDomain': true
            }
        }

        const eid = eventId || _.get(this.props, 'location.query.eid');
        if(eid) {
            axios.get(`${hostname}event/stat?id=${eid}`, config).then(
                (data) => data.data
            ).then((data) => {
                let DataProcess = [];

                let PromisesPeople = data.who_join.map((mongoId) => {
                    return getUserIdInfo(mongoId);
                });
                let whoAccepted = data.who_join.map((mongoId) => {
                    return data.who_accepted.indexOf(mongoId) !== -1;
                });
                let whoCheckIn = data.who_join.map((mongoId, index) => {
                    return whoAccepted[index] && data.who_completed.indexOf(mongoId) !== -1;
                });

                if (_.get(data, 'forms', []).length > 0) {
                    DataProcess.push(axios.get(`${hostname}form?id=${data.forms[data.forms.length - 1].id}&opt=responses`, config)
                        .then((dat) => dat.data.form)
                        .then((dat) => {
                            return {
                                questions: dat.questions,
                                responses: dat.responses.reduce((obj, item) => {
                                    obj[item.user_id] = {
                                        answers: item.answers
                                    }
                                    return obj;
                                }, {})
                            };
                        }));
                }
                

                DataProcess.push(Promise.all(PromisesPeople).then((Datas) => {
                    return Datas.reduce((obj, Data, index) => {
                        obj[Data._id] = data.require_field.concat(data.optional_field).reduce((Obj, field) => {
                            Obj[ServerToClientFields[field]] = Data[field];
                            Obj["is_accepted"] = whoAccepted[index];
                            Obj["is_check_in"] = whoCheckIn[index];
                            return Obj;
                        }, {});
                        return obj;
                    }, {});
                }))
                
                Promise.all(DataProcess).then((Dat) => {
                    if (this._isMounted) {
                        this.setState((prevState) => {
                            if (_.get(data, 'forms', []).length > 0) {
                                return ({
                                    ...prevState,
                                    fields: data.require_field.map((item) => ServerToClientFields[item]).map((text) => text + ' *').concat(data.optional_field.map((item) => ServerToClientFields[item])),
                                    peopleData: Dat[1],
                                    questions: Dat[0].questions,
                                    responses: Dat[0].responses,
                                    isLoad: true
                                });
                            }
                            return ({
                                ...prevState,
                                fields: data.require_field.map((item) => ServerToClientFields[item]).map((text) => text + ' *').concat(data.optional_field.map((item) => ServerToClientFields[item])),
                                peopleData: Dat[0],
                                isLoad: true
                            });
                        })
                    }
                })
            });
        }
    }

    onPopUpError(error) {
        this.props.blur_bg();
        if(error.response) {
            this.props.set_pop_up_item(<ErrorPopUp onExit={this.props.toggle_pop_item} errorMsg={`Oh! Ow! something went wrong!`} errorDetail={`Got Error code: ${error.response.status} with message "${error.response.data.err}"`} />);
        } else if(error.errorMsg) {
            this.props.set_pop_up_item(<ErrorPopUp onExit={this.props.toggle_pop_item} errorMsg={_.get(error, 'errorMsg', 'Oh! Ow! something went wrong')} errorDetail={_.get(error, 'errorDetail', 'Please check your internet connection')} />);
        }
        this.props.display_pop_item();
    }

    componentDidMount() {
        this._isMounted = true
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.fb.isLogin && !this.props.fb.isLogin) {
            let tmp = setInterval(() => {
                if(getCookie("fb_sever_token").length > 0) {
                    this.onGetStat(_.get(nextProps, 'location.query.eid'));
                    clearInterval(tmp);
                }
            }, 1000);
        }
    }

    onPopUpMsg(ArrayOfMessage, callback) {
        let new_onExit = () => {
            this.props.toggle_pop_item();
            if (typeof (callback) === "function") callback();
        }

        new_onExit = new_onExit.bind(this);

        this.props.blur_bg();
        this.props.set_pop_up_item(<MsgPopUp onExit={new_onExit} colourStr="green">
            {
                ArrayOfMessage.map((string, index) => <span key={index}>{string}<br /></span>)
            }
        </MsgPopUp>);
        this.props.display_pop_item();
    }

    onSentAccepted(accepted_ids, rejected_ids) {
        if(accepted_ids.length > 0 || rejected_ids.length > 0) {
            console.log(accepted_ids, rejected_ids);
            this.onPopUpMsg([`Accept: Accepted: ${accepted_ids.length} and Rejected: ${rejected_ids.length}`]);
        }
    }

    onSentCheckIn(accepted_ids, rejected_ids) {
        if (accepted_ids.length > 0 || rejected_ids.length > 0) {
            console.log(accepted_ids, rejected_ids);
            this.onPopUpMsg([`Check In: Accepted: ${accepted_ids.length} and Rejected: ${rejected_ids.length}`]);
        }
    }

    onMessageSent(ids, message) {
        if(ids.length > 0 && message.length > 0) {
            console.log(message);
            this.onPopUpMsg([`Message '${message}' is sent!`]);
        }
    }
    
    onErrorMsg(errorMsg, errorDetail) {
        this.onPopUpError({
            errorMsg: errorMsg,
            errorDetail: errorDetail
        });
    }

    render() {
        if (this.props.user.events.admin.event.indexOf(this.props.location.query.eid) === -1) {
            return (
                <section role="main-content" style={{ 'backgroundColor': '#FFF', 'borderTop': '1px solid #F1F1F1', 'display': 'flex', 'justifyContent': 'center', 'alignItems': 'center', 'height': 'calc(100vh - 65px)' }}>
                    <div style={{
                        'display': 'flex',
                        'justifyContent': 'center',
                        'alignItems': 'center',
                        'width': '80vw'
                    }}>
                        <i className="fa fa-ban" style={{
                            'fontSize': '7em',
                            'color': 'red',
                            'marginRight': '20px'
                        }} />
                        <h1 style={{'fontSize': `2em`}}>
                            {`You're not authorized. Please make sure you are administrator of this event.`}
                        </h1>
                    </div>
                </section>
            );
        }
        return (
            <section role="main-content" style={{'backgroundColor': '#FFF', 'borderTop': '1px solid #F1F1F1'}}>
                <Table
                    isLoad={this.state.isLoad}
                    fields={this.state.fields}
                    onSentAccepted={this.onSentAccepted}
                    onSentCheckIn={this.onSentCheckIn}
                    onMessageSent={this.onMessageSent}
                    onErrorMsg={this.onErrorMsg}
                    eventData={this.props.map.events[this.props.location.query.eid]}
                    values={this.state.peopleData}
                    questions={this.state.questions}
                    response={this.state.responses}
                />
            </section>
        );
    }
}

export default normalPage(pages(tablePage, true));
