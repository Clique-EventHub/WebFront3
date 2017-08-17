import React, { Component } from 'react';
// import * as FormFunc from './auxlillaryForm';
import MultipleChoice from './MultipleChoice';
// import EditDiv from './EditDiv';
import './style/questionForm.css';
import { afterSlash } from '../actions/common';
import { hostname } from '../actions/index';

const enableTestFeature = false;

/*
    Test feature
        - Set Maximum Choices for Bullet point
        - Move cursor up with edit choices and delete if that choices is empty
        - Multiple state for Both Bullet point and CheckBox
*/

/* Individual Question format

{
    'question': [String],
    'type': [String -> "short answer", "bullet", "check box", "spinner"],
    'choices': [String -> null or Array Of String]
}

*/

const BulletState= [{
    'type': 'none',
    'value': 'false'
}, {
    'type': 'circle',
    'value': 'true'
}];

const CheckBoxState = [{
    'type': 'none',
    'value': 'false'
}, {
    'type': 'square',
    'value': 'true'
}];

class QuestionItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            'isEdit': false,
            'isEnter': false,
            'choicesIndex': 0,
            'isLast': false,
            'maxBullet': 1,
            'response': null
        }

        this.resizeTextArea = this.resizeTextArea.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onEditClick = this.onEditClick.bind(this);
        this.onChangeChoice = this.onChangeChoice.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onAdd = this.onAdd.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.onInputClick = this.onInputClick.bind(this);
        this.updateMax = this.updateMax.bind(this);
        this.onGetResponse = this.onGetResponse.bind(this);
        this.onUpdateResponseSpinner = this.onUpdateResponseSpinner.bind(this);
        this.onQuestionDelete = this.onQuestionDelete.bind(this);
    }

    resizeTextArea(refName) {
        let textArea = this.refs[refName];
        textArea.style.height = 'auto';
        textArea.style.height = textArea.scrollHeight+'px';
    }

    onEditClick() {
        this.setState({
            ...this.state,
            'isEdit': !this.state.isEdit
        });
    }

    onChange(refName) {
        if(typeof(this.props.onChangeText) === "function") this.props.onChangeText(this.refs[refName].value, this.props.index);
    }

    onChangeChoice(index, refName) {
        let new_choices = this.props.question.choices;
        new_choices[index] = this.refs[refName].value;

        if(typeof(this.props.onChangeChoices) === "function") this.props.onChangeChoices(new_choices);
    }

    onDelete(index) {
        let new_choices = this.props.question.choices.slice(0, index).concat(this.props.question.choices.slice(index+1, this.props.question.choices.length));
        if(typeof(this.props.onChangeChoices) === "function") this.props.onChangeChoices(new_choices);
    }

    onAdd(isEnter, choicesIndex, isLast) {
        let new_choices = this.props.question.choices.concat(this.refs["add-choice"].value);
        this.refs["add-choice"].value = '';

        if(typeof(this.props.onChangeChoices) === "function") this.props.onChangeChoices(new_choices);
        this.setState({
            ...this.state,
            'isEnter': (isEnter) ? isEnter : false,
            'choicesIndex': (isLast) ? choicesIndex + 1 : this.state.choicesIndex + 1,
            'isLast': isLast
        });
    }

    onKeyPress(currentIndex, key) {
        if(key === 'Enter') {
            if(this.state.choicesIndex < this.props.question.choices.length-1) {
                this.onInputClick(this.state.choicesIndex+1);
                this.refs[`input-${this.state.choicesIndex+1}`].focus();
            } else {
                this.onAdd(true, currentIndex, true);
            }
        }
    }

    onInputClick(targetIndex) {
        this.setState({
            ...this.state,
            'choicesIndex': targetIndex
        })
    }

    onQuestionDelete() {
        this.props.onDelete();
        this.setState({
            ...this.state,
            'text': (this.props.question.question) ? this.props.question.question : '',
            'type': (this.props.type) ? this.props.type : 'short answer',
            'index': (typeof(this.props.index) === "number") ? this.props.index : 0
        })
    }

    componentDidUpdate() {
        if(this.state.isEdit) {
            this.resizeTextArea("me");
        }

        if(this.state.isEnter) {
            if(this.state.isLast) {
                this.refs[`input-${this.props.question.choices.length-1}`].focus();
            }

            this.setState({
                ...this.state,
                isEnter: false,
                isLast: false
            });
        }

        this.onUpdateResponseSpinner();
    }

    componentDidMount() {
        this.onUpdateResponseSpinner();
    }

    range(start, end, step) {
        let rObj = [];
        for(var i = start; i < end; i += step) rObj.push(i);
        return rObj;
    }

    updateMax() {
        this.setState({
            ...this.state,
            'maxBullet': (this.refs["maxBullet"].value) ? this.refs["maxBullet"].value : 0
        })
    }

    onGetResponse(response) {
        if(typeof(this.props.onGetResponse) === "function") this.props.onGetResponse(response, this.props.index);
    }

    onUpdateResponseSpinner() {
        if(this.props.question.type === "spinner") {
            if(this.props.response === null || (this.props.response === '' && this.props.question.choices[0] !== this.props.response)){
                if(this.props.question.choices.length > 0) {
                    this.setState({
                        ...this.state,
                        'response': this.props.question.choices[0]
                    })
                }
            }
        }
    }

    render() {
        if(this.state.isEdit) {
            let answerItem;
            if(this.props.question.type === 'short answer') {
                answerItem = null;
            } else {
                answerItem = (
                    <div className="edit-choices">
                        {
                            this.props.question.choices.map((item, index) => {
                                return (
                                    <div key={index}>
                                        <input className={this.props.question.type} type="text" value={item} onClick={() => {this.onInputClick(index);}} onChange={(e) => {this.onChangeChoice(index, `input-${index}`);}} onKeyDown={(e) => {this.onKeyPress(index, e.key);}} ref={`input-${index}`} />
                                        <span className="icon" />
                                        <button className="invisible square-round" onClick={() => {this.onDelete(index)}}>
                                            <img src="../../resource/images/X.svg" alt="Delete" />
                                        </button>
                                    </div>
                                )
                            })
                        }
                    </div>
                );
            }
            return (
                <div className={`question-item fullwidth ${this.props.isError ? 'onError': ''}`}>
                    <section className="question">
                        <textarea rows="1" value={this.props.question.question} onChange={() => {this.onChange("me"); this.resizeTextArea("me");}} ref="me" />
                        {(this.props.isEditable) ? (<button className="edit invisible square-round" onClick={this.onEditClick}><i className="fa fa-pencil-square-o active" aria-hidden="true"></i></button>) : null}
                        {(this.props.isEditable) ? (<button className="bin invisible square-round" onClick={this.onQuestionDelete}><i className="fa fa-trash-o" aria-hidden="true"></i></button>) : null}
                    </section>
                    {answerItem}
                    {
                        (this.props.question.type !== 'short answer') ? (
                            <section className="add">
                                <input ref="add-choice" onKeyPress={(e) => {
                                        if(e.charCode === 13) {
                                            this.onAdd();
                                        }
                                    }}/><span className="icon-plus" onClick={this.onAdd}/>
                                {
                                    (this.props.question.type === 'bullet' && enableTestFeature) ? (
                                        <select value={this.state.maxBullet} style={{'marginLeft': '10px'}} onChange={this.updateMax} ref="maxBullet">
                                            {
                                                this.range(1, this.props.question.choices.length + 1, 1).map((num) => {
                                                    return <option value={num} key={num}>{num}</option>
                                                })
                                            }
                                        </select>
                                    ) : null
                                }
                            </section>
                        ) : null
                    }
                </div>
            )
        }

        let answerItem;
        switch (this.props.question.type) {
            case 'short answer':
                answerItem = (<textarea ref="me" onKeyUp={() => {this.resizeTextArea("me"); this.onGetResponse(this.refs.me.value); this.setState({ ...this.state, 'response': this.refs.me.value}); }}/>);
                break;
            case 'bullet':
                answerItem = (<MultipleChoice state={BulletState} options={this.props.question.choices} maxActive={this.state.maxBullet} containerClass="FormChoice circle" onUpdate={this.onGetResponse} />);
                break;
            case 'check box':
                answerItem = (<MultipleChoice state={CheckBoxState} options={this.props.question.choices} maxActive={this.props.question.choices.length} containerClass="FormChoice" onUpdate={this.onGetResponse} />);
                break;
            case 'spinner':
                answerItem = (
                    <div>
                        <select value={this.props.response.answer ? this.props.response.answer : 0} onChange={() => {this.onGetResponse(this.refs.spinner.value);}} onClick={() => {this.onGetResponse(this.refs.spinner.value);}} ref="spinner">
                            { this.props.question.choices.map((text, index) => {
                                return (<option value={text} key={index}>{text}</option>)
                            }) }
                        </select>
                    </div>
                );
                break;
            default:
                answerItem = null;
        }

        let new_text = this.props.question.question.split("\n");

        return (
            <div className={`question-item fullwidth ${this.props.isError ? 'onError': ''}`}>
                <section className="question">
                    <span>{new_text.map((item, index) => {
                            let new_item = item.split("    ");
                            let isTextStart = true;
                            new_item = new_item.filter((text) => {
                                isTextStart = isTextStart&&(text.replace(" ", "").length > 0);
                                return (isTextStart || (text.replace(" ", "").length > 0));
                            });
                            if(new_item.length > 1) {
                                return <span key={index}>{
                                        new_item.map((text, indexs) => {
                                            if(index === new_item.length - 1) return <span key={indexs}>{text}<br /></span>;
                                            return <span key={indexs}>{text}<span className="tab" /></span>
                                        })
                                    }</span>
                            }
                            return <span key={index}>{item}<br /></span>;
                        })}</span>
                    {(this.props.isEditable) ? (<button className="edit invisible square-round" onClick={this.onEditClick}><i className="fa fa-pencil-square-o" aria-hidden="true"></i></button>) : null}
                    {(this.props.isEditable) ? (<button className="bin invisible square-round" onClick={this.onQuestionDelete}><i className="fa fa-trash-o" aria-hidden="true"></i></button>) : null}
                </section>
                { answerItem }
            </div>
        );
    }
}

class QuestionForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            'questions': this.props.questions,
            'responses': this.props.questions.map((item) => {
                return {
                    'question': item.question,
                    'type': item.type,
                    'answer': null
                }
            }),
            'validateError': [],
            'isAdmin': this.props.isAdmin,
            'formTitle': (this.props.formTitle) ? this.props.formTitle : 'Untitled',
        }
        this.resizeTextArea = this.resizeTextArea.bind(this);
        this.onAddQuestion = this.onAddQuestion.bind(this);
        this.onDeleteQuestion = this.onDeleteQuestion.bind(this);
        this.onGetResponse = this.onGetResponse.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
        this.onValidate = this.onValidate.bind(this);
        this.onChangeChoices = this.onChangeChoices.bind(this);
        this.onSave = this.onSave.bind(this);
    }

    resizeTextArea(refName) {
        let textArea = this.refs[refName];
        textArea.style.height = 'auto';
        textArea.style.height = textArea.scrollHeight+'px';
    }

    onChangeChoices(index, new_choices) {
        let new_questions = this.state.questions;
        new_questions[index].choices = new_choices;
        this.setState({
            ...this.state,
            'questions': new_questions
        })
    }

    onGetResponse(res, index) {
        let new_response = [...this.state.responses];
        new_response[index].answer = res;
        this.setState({
            ...this.state,
            'responses': new_response
        });
    }

    onChangeText(new_text, index) {
        let new_questions = [...this.state.questions];
        let new_responses = [...this.state.responses];

        new_questions[index].question = new_text;
        new_responses[index].question = new_text;
        this.setState({
            ...this.state,
            'questions': new_questions,
            'responses': new_responses
        });
    }

    onAddQuestion(type) {
        if(type) {
            if(['short answer', 'bullet', 'spinner', 'check box'].includes(type)) {
                this.setState({
                    ...this.state,
                    'questions': this.state.questions.concat({
                        'question': 'No Text',
                        'type': type,
                        'choices': (type === 'short answer') ? null : []
                    }),
                    'responses': this.state.responses.concat({
                        'question': 'No Text',
                        'type': type,
                        'answer': null
                    })
                })
            }
        }
    }

    onDeleteQuestion(index) {
        if(index >= 0 && index < this.state.questions.length) {
            this.setState({
                ...this.state,
                'questions': this.state.questions.slice(0, index).concat(this.state.questions.slice(index+1, this.state.questions.length)),
                'responses': this.state.responses.slice(0, index).concat(this.state.responses.slice(index+1, this.state.responses.length))
            });
        }
    }

    onValidate() {
        let tmp = true;
        let onErrorIndex = [];
        for(let i = 0; i < this.state.responses.length; i++) {
            if(this.state.responses[i].answer === null) {
                tmp = false;
                onErrorIndex.push(i);
            } else if(this.state.responses[i].type === "bullet" || this.state.responses[i].type === "check box") {
                if(this.state.responses[i].answer.constructor !== Array || this.state.responses[i].answer.length === 0) {
                    tmp = false;
                    onErrorIndex.push(i);
                }
            }
        }

        this.setState({
            ...this.state,
            'validateError': onErrorIndex
        });

        if(tmp && typeof(this.props.onSent) === "function") this.props.onSent(this.state.responses);

        return tmp;
    }

    onSave() {
        if(typeof(this.props.onSave) === "function") this.props.onSave({'questions': this.state.questions, 'formTitle': this.state.formTitle});
    }

    render() {
        return (
            <div className="basic-card-no-glow form card-width">
                <div className={`top-color ${this.props.shadeColor}`}></div>
                {(this.state.isAdmin) ? (
                    <input className="title-name" type="text" ref="title" value={this.state.formTitle} onChange={() => {this.setState({ ...this.state, 'formTitle': this.refs.title.value})}} />
                ) : (
                    <div className="title-name">{this.props.formTitle}</div>
                ) }
                <div className="top-bar">
                    {(this.props.event) ? <div className="event-container">{this.props.event.title} </div>: 'Loading...'}
                    {(this.props.channel) ? (
                        <div className="channel-container">
                            {
                                (this.props.channel.picture) ? (<img className="thumbnail" src={this.props.channel.picture} alt="icon" />) : (<div className={`thumbnail ${this.props.channelShade}`} />)
                            }
                            {this.props.channel.name}
                        </div>) : null}
                </div>
                <p className="hr fullwidth" />
                {
                    this.state.questions.map((item, index) => {
                        return (
                            <QuestionItem key={index} isError={this.state.validateError.includes(index)} index={index} question={item} response={this.state.responses[index]} onDelete={() => {this.onDeleteQuestion(index);}} isEditable={this.state.isAdmin} onChangeChoices={(new_choice)=>{this.onChangeChoices(index, new_choice);}} onGetResponse={(res) => {this.onGetResponse(res, index);}} onChangeText={this.onChangeText} />
                        );
                    })
                }
                {
                    (this.state.isAdmin) ? (
                        <div className="flex flex-aligns-item flex-justify-center added-zone">
                            <span className="icon-plus big" />
                            <div className="question-type">
                                <button className="round small" onClick={() => { this.onAddQuestion('short answer') }}>Add text answer</button>
                                <button className="round small" onClick={() => { this.onAddQuestion('check box') }}>Add checkbox</button>
                                <button className="round small" onClick={() => { this.onAddQuestion('bullet') }}>Add bullet point</button>
                                <button className="round small" onClick={() => { this.onAddQuestion('spinner') }}>Add spinner</button>
                            </div>
                        </div>
                    ) : (<div style={{'textAlign': 'right', 'marginTop': '30px'}}>
                        <button className="round" onClick={this.onValidate}>Send</button>
                    </div>)
                }
                {
                    (this.state.isAdmin) ? (
                        <div style={{'textAlign': 'right'}}>
                            <p className="hr" />
                            <button className="round red mar-h-10" >Cancel</button>
                            <button className="round" onClick={this.onSave} >Save</button>
                        </div>
                    ) : null
                }
            </div>
        );
    }
}

QuestionForm.defaultProps = {
    questions: [],
    isAdmin: false,
    onSent: (data) => {  },
    onSave: (data) => {  },
    shadeColor: "shade-blue"
}

export default QuestionForm;
