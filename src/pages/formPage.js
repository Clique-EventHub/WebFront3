import React, { Component } from 'react';
import pages from '../hoc/pages';
import normalPage from '../hoc/normPage';
import QuestionForm from '../components/questionForm';
import { getRandomShade, getCookie, getEvent, getChannel } from '../actions/common';
import ReactLoading from 'react-loading';
import { hostname } from '../actions/index';
import axios from 'axios';
import ErrorPopUp from '../components/ErrorPopUp';
import MsgPopUp from '../components/MsgPopUp';

class formPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            'shadeColor': getRandomShade(),
            'eventShade': getRandomShade(),
            'channelShade': getRandomShade(),
            'questions': null,
            'formTitle': '',
            'event': null,
            'channel': null,
            'isError': false,
            'error': null,
            'isLoad': false,
            'meta': {
                'formId': (this.props.location.query.id) ? this.props.location.query.id : this.props.formId,
                'eventId': (this.props.location.query.eid) ? this.props.location.query.eid: '',
                'channelId': (this.props.location.query.cid) ? this.props.location.query.cid : '',
                'isAdmin': (typeof(this.props.location.query.state) === "undefined") ? this.props.isAdmin : (this.props.location.query.state === "0")
            }
        }
        this.onStart = this.onStart.bind(this);
        this.onSent = this.onSent.bind(this);
        this.onSave = this.onSave.bind(this);
        this.onPopUpError = this.onPopUpError.bind(this);
        this.onPopUpMsg = this.onPopUpMsg.bind(this);
    }

    componentWillMount() {
        this._isMounted = true;
        this.onStart();
        document.title = "Event Hub | Form";
    }
    
    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidMount() {
        this._isMounted = true;
    }

    onStart() {
        let config = {
            'headers': {
                'Authorization': ('JWT ' + getCookie('fb_sever_token')),
                'crossDomain': true
            }
        }

        if(this.state.meta.formId) {
            //Answering form or edit old form
            axios.get(`${hostname}form?id=${this.state.meta.formId}`, config).then((data) => {
                if(this._isMounted) {
                    this.setState((prevState) => {
                        return ({
                            ...prevState,
                            'questions': data.data.form.questions,
                            'formTitle': data.data.form.title,
                            'meta': {
                                ...this.state.meta,
                                'eventId': data.data.form.event,
                                'channelId': data.data.form.channel
                            },
                            'isLoad': true
                        });
                    });
                }

                getEvent(data.data.form.event).then((data) => {
                    if(this._isMounted) {
                        this.setState((prevState) => {
                            return ({
                                ...prevState,
                                'event': data
                            });
                        })
                    }
                })

                getChannel(data.data.form.channel).then((data) => {
                    if(this._isMounted) {
                        this.setState((prevState) => {
                            return ({
                                ...prevState,
                                'channel': data
                            });
                        })
                    }
                })

                return true;
            }, (error) => {
                this.onPopUpError(error);
                return false;
            });
        } else if(this.state.meta.isAdmin) {
            //Create new form
            getEvent(this.state.meta.eventId).then((data) => {
                if(this._isMounted) {
                    this.setState((prevState) => {
                        return ({
                            ...prevState,
                            'event': data
                        });
                    })
                }
            })

            getChannel(this.state.meta.channelId).then((data) => {
                if(this._isMounted) {
                    this.setState((prevState) => {
                        return ({
                            ...prevState,
                            'channel': data
                        });
                    })
                }
            })
            
            console.log(this._isMounted)
            if(this._isMounted) {
                this.setState((prevState) => {
                    return ({
                        ...prevState,
                        'questions': [],
                        'formTitle': 'Untitled',
                        'isLoad': true
                    });
                })
            }
        } else {
            //No formId and is Not Admin
            let error = {
                response: {
                    status: 403,
                    data: {
                        err: "You are not authorized"
                    }
                },
            }
            this.onPopUpError(error);
        }
    }

    onSent(responses) {
        //User

        let new_response = [];
        responses.forEach((item) => {
            let ans = item.answer;
            if(ans.constructor === Array) {
                ans = '';
                item.answer.forEach((obj, index) => {
                    ans = ans.concat(obj.text)
                    if(index !== item.answer.length-1) ans = ans.concat(', ');
                });
            }

            new_response.push({
                'question': item.question,
                'answer': ans
            });
        })

        let config = {
            'headers': {
                'Authorization': ('JWT ' + getCookie('fb_sever_token')),
                'crossDomain': true
            }
        }


        // let newer_response = {};
        // new_response.forEach((item) => {
        //     newer_response[`_${item.question}`] = item.answer;
        // })
        // console.log(`${hostname}form?id=${this.state.meta.formId}`);
        //
        // console.log({'responses': new_response});

        // console.log(newer_response);

        axios.put(`${hostname}form?id=${this.state.meta.formId}`, {responses: new_response}, config).then((data) => {
            this.onPopUpMsg(["Thank you for answer our question(s)", "Have a nice day!"], () => {
                this.props.context.router.push('/');
            });
        }, (error) => {
            this.onPopUpError(error);
        });
    }

    onSave(questions) {
        //Admin

        let config = {
            'headers': {
                'Authorization': ('JWT ' + getCookie('fb_sever_token')),
                'crossDomain': true
            }
        }

        if(this.state.meta.formId) {
            axios.post(`${hostname}form?id=${this.state.meta.formId}`, {
                'title': questions.formTitle,
                'questions': questions.questions,
                'event': this.state.meta.eventId,
                'channel': this.state.meta.channelId
            }, config).then((data) => {
                this.onPopUpMsg(["You successfully uploaded Form to server", "Congradulation"], () => {this.props.context.router.push('/')});
            }, (error) => {
                this.onPopUpError(error);
            });
        } else {
            axios.post(`${hostname}form`, {
                'title': questions.formTitle,
                'questions': questions.questions,
                'event': this.state.meta.eventId,
                'channel': this.state.meta.channelId
            }, config).then((data) => {
                this.onPopUpMsg(["You successfully uploaded Form to server", "Congradulation"], () => {this.props.context.router.push('/')});
            }, (error) => {
                this.onPopUpError(error);
            });
        }
    }

    onPopUpMsg(ArrayOfMessage, callback) {
        let new_onExit = () => {
            this.props.toggle_pop_item();
            if(typeof(callback) === "function") callback();
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

    onPopUpError(error) {
        this.props.blur_bg();
        if(error.response) {
            this.props.set_pop_up_item(<ErrorPopUp onExit={this.props.toggle_pop_item} errorMsg={`Oh! Ow! something went wrong!`} errorDetail={`Got Error code: ${error.response.status} with message "${error.response.data.err}"`} />);
        } else {
            this.props.set_pop_up_item(<ErrorPopUp onExit={this.props.toggle_pop_item} errorMsg={`Oh! Ow! something went wrong!`} errorDetail="Please check your internet connection" />);
        }
        this.props.display_pop_item();
    }

    render() {
        return (
            <section role="main-content" className="no-padding">
                {
                    (!this.state.isLoad) ? (
                        <div className="basic-card-no-glow card-width form" style={{'paddingBottom': '35px'}}>
                            <div style={{'fontSize': '30px', 'margin': 'auto', 'color': '#878787', 'textAlign': 'center'}}>
                                <div style={{'margin': 'auto', 'width': '50px', 'display': 'inline-block', 'position': 'relative', 'top': '12px', 'marginLeft': '5px'}}>
                                    <ReactLoading type={'bars'} color={'#878787'} height='40px' width='40px' />
                                </div>
                                Loading
                                <div style={{'margin': 'auto', 'width': '50px', 'display': 'inline-block', 'position': 'relative', 'top': '12px', 'marginLeft': '5px'}}>
                                    <ReactLoading type={'bars'} color={'#878787'} height='40px' width='40px' />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <QuestionForm
                            questions={this.state.questions}
                            event={this.state.event}
                            channel={this.state.channel}
                            isAdmin={this.state.meta.isAdmin}
                            onSent={this.onSent}
                            onSave={this.onSave}
                            formTitle={this.state.formTitle}
                            shadeColor={this.state.shadeColor}
                            eventShade={this.state.eventShade}
                            channelShade={this.state.channelShade}
                        />
                    )
                }
            </section>
        );
    }
}

formPage.defaultProps = {
    'formId': '',
    'isAdmin': false
}

/*
    Case props
        - With 'formId'
            - isAdmin is true - Edit past form
            - isAdmin is false - Answering form
        - Without 'formId'
            - isAdmin is true - Create new form
            - isAdmin is false - This should mot happen
*/

export default normalPage(pages(formPage, true));
