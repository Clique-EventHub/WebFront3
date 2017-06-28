import React, { Component } from 'react';
import pages from '../hoc/pages';
import normalPage from '../hoc/normPage';
import QuestionForm from '../components/questionForm';
import { getRandomShade, getCookie, getEventThumbnail, getChannelThumbnail } from '../actions/common';
import ReactLoading from 'react-loading';
import { hostname } from '../actions/index';
import axios from 'axios';

class formPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            'shadeColor': getRandomShade(),
            'eventShade': getRandomShade(),
            'channelShade': getRandomShade(),
            'questions': null,
            'formTitle': null,
            'event': null,
            'channel': null
        }

        this.onStart = this.onStart.bind(this);
        this.onSent = this.onSent.bind(this);
        this.onSave = this.onSave.bind(this);
    }

    componentWillMount() {
        setTimeout(() => {
            this.onStart();
        }, 1000);
    }

    onStart() {
        let config = {
            'headers': {
                'Authorization': ('JWT ' + getCookie('fb_sever_token'))
            }
        }

        axios.get(`${hostname}form?id=${this.props.formId}`, config).then((data) => {
            this.setState({
                ...this.state,
                'questions': data.data.form.questions,
                'formTitle': data.data.form.title
            });
            return true;
        }, (error) => {
            console.log(error);
            return false;
        });

        getEventThumbnail(this.props.eventId, {
            isUseAuthorize: true,
            onSuccess: (data) => {
                this.setState({
                    ...this.state,
                    'event': data
                });
            }
        })

        getChannelThumbnail(this.props.channelId, {
            isUseAuthorize: true,
            onSuccess: (data) => {
                this.setState({
                    ...this.state,
                    'channel': data
                });
            }
        })
    }

    // componentDidUpdate() {
    //     console.log(this.state);
    // }

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
                'Authorization': ('JWT ' + getCookie('fb_sever_token'))
            }
        }

        axios.put(`${hostname}form?id=${this.props.formId}`, {'response': new_response}, config).then((data) => {
            this.props.context.router.push('/');
        }, (error) => {
            console.log(error);
        });

    }

    onSave(questions) {
        //Admin
        console.log("Questions Form");
        console.log(questions);
    }

    render() {
        return (
            <section role="main-content" className="no-padding">
                {
                    (this.state.questions === null || this.state.event === null || this.state.channel === null) ? (
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
                        <QuestionForm questions={this.state.questions} event={this.state.event} channel={this.state.channel} isAdmin={false} onSent={this.onSent} onSave={this.onSave} formTitle={this.state.formTitle} shadeColor={this.state.shadeColor} eventShade={this.state.eventShade} channelShade={this.state.channelShade} />
                    )
                }
            </section>
        );
    }
}

formPage.defaultProps = {
    'formId': '595330d746643c4fda2f464f',
    'eventId': '594bf476e374d100140f04ec',
    'channelId': '5946205a4b908f001403aba5'
}

export default normalPage(pages(formPage, true));
