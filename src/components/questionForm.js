import React, { Component } from 'react';
// import * as FormFunc from './auxlillaryForm';
import MultipleChoice from './MultipleChoice';
// import EditDiv from './EditDiv';
import './style/questionForm.css';

const enableTestFeature = false;

/* Individual Question format

{
    'question': [String],
    'type': [String -> "short answer", "bullet", "check box", "spinner"],
    'choices': [String -> null or Array Of String]
}

*/

const CheckBoxState= [{
    'type': 'none',
    'value': 'false'
}, {
    'type': 'square',
    'value': 'true'
}];

const BulletState = [{
    'type': 'none',
    'value': 'false'
}, {
    'type': 'circle',
    'value': 'true'
}];

class QuestionItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            'isEdit': false,
            'text': (this.props.defaultText) ? this.props.defaultText : '',
            'type': (this.props.type) ? this.props.type : 'short answer',
            'choices': (this.props.choices) ? this.props.choices : null,
            'index': (typeof(this.props.index) === "number") ? this.props.index : 0,
            'isEnter': false,
            'choicesIndex': 0,
            'isLast': false,
            'maxCheckBox': 1,
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
        this.setState({
            ...this.state,
            'text': this.refs[refName].value
        });

        if(typeof(this.props.onChangeText) === "function") this.props.onChangeText(this.refs[refName].value, this.state.index);
    }

    onChangeChoice(index, refName) {
        let new_choices = this.state.choices;
        new_choices[index] = this.refs[refName].value;
        this.setState({
            ...this.state,
            'choices': new_choices
        });
    }

    onDelete(index) {
        let new_choices = this.state.choices.slice(0, index).concat(this.state.choices.slice(index+1, this.state.choices.length));
        this.setState({
            ...this.state,
            'choices': new_choices
        });
    }

    onAdd(isEnter, choicesIndex, isLast) {
        let new_choices = this.state.choices.concat(this.refs["add-choice"].value);
        this.refs["add-choice"].value = '';
        this.setState({
            ...this.state,
            'choices': new_choices,
            'isEnter': (isEnter) ? isEnter : false,
            'choicesIndex': (isLast) ? choicesIndex + 1 : this.state.choicesIndex + 1,
            'isLast': isLast
        });
    }

    onKeyPress(currentIndex, key) {
        if(key === 'Enter') {
            if(this.state.choicesIndex < this.state.choices.length-1) {
                this.onInputClick(this.state.choicesIndex+1);
                this.refs[`input-${this.state.choicesIndex+1}`].focus();
            } else {
                this.onAdd(true, currentIndex, true);
            }
        }
        // if(key === 'Backspace') {
        //     if(this.refs[`input-${this.state.choicesIndex}`].value === '') {
        //         this.onDelete(this.state.choicesIndex-1);
        //         this.refs[`input-${this.state.choicesIndex-1}`].focus();
        //         this.onInputClick(this.state.choicesIndex-1);
        //     }
        // }
    }

    onInputClick(targetIndex) {
        this.setState({
            ...this.state,
            'choicesIndex': targetIndex
        })
    }

    componentDidUpdate() {
        if(this.state.isEdit) {
            this.resizeTextArea("me");
        }

        if(this.state.isEnter) {
            if(this.state.isLast) {
                this.refs[`input-${this.state.choices.length-1}`].focus();
            }

            this.setState({
                ...this.state,
                isEnter: false,
                isLast: false
            });
        }

        this.onUpdateResponseSpinner();
    }

    componentWillMount() {
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
            'maxCheckBox': (this.refs["maxCheckBox"].value) ? this.refs["maxCheckBox"].value : 0
        })
    }

    onGetResponse(response) {
        this.setState({
            ...this.state,
            'response': response
        });
        if(typeof(this.props.onGetResponse) === "function") this.props.onGetResponse(response, this.state.index);
    }

    onUpdateResponseSpinner() {
        if(this.state.type === "spinner") {
            if(this.state.response === null || (this.state.response === '' && this.state.choices[0] !== this.state.response)){
                if(this.state.choices.length > 0) {
                    this.setState({
                        ...this.state,
                        'response': this.state.choices[0]
                    })
                }
            }
        }
    }

    render() {
        if(this.state.isEdit) {
            let answerItem;
            if(this.state.type === 'short answer') {
                answerItem = null;
            } else {
                answerItem = (
                    <div className="edit-choices">
                        {
                            this.state.choices.map((item, index) => {
                                return (
                                    <div key={index}>
                                        <input className={this.state.type} type="text" value={item} onClick={() => {this.onInputClick(index);}} onChange={(e) => {this.onChangeChoice(index, `input-${index}`);}} onKeyDown={(e) => {this.onKeyPress(index, e.key);}} ref={`input-${index}`} />
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
                        <textarea rows="1" value={this.state.text} onChange={() => {this.onChange("me"); this.resizeTextArea("me");}} ref="me" />
                        {(this.props.isEditable) ? (<button className="edit invisible square-round" onClick={this.onEditClick}>Done</button>) : null}
                        {(this.props.isEditable) ? (<button className="bin invisible square-round" onClick={this.props.onDelete}>Bin</button>) : null}
                    </section>
                    {answerItem}
                    {
                        (this.state.type !== 'short answer') ? (
                            <section className="add">
                                <input ref="add-choice" onKeyPress={(e) => {
                                        if(e.charCode === 13) {
                                            this.onAdd();
                                        }
                                    }}/><span className="icon-plus" onClick={this.onAdd}/>
                                {
                                    (this.state.type === 'check box' && enableTestFeature) ? (
                                        <select value={this.state.maxCheckBox} style={{'marginLeft': '10px'}} onChange={this.updateMax} ref="maxCheckBox">
                                            {
                                                this.range(1, this.state.choices.length + 1, 1).map((num) => {
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
        switch (this.state.type) {
            case 'short answer':
                answerItem = (<textarea ref="me" onKeyUp={() => {this.resizeTextArea("me"); this.onGetResponse(this.refs.me.value); this.setState({ ...this.state, 'response': this.refs.me.value}); }}/>);
                break;
            case 'bullet':
                answerItem = (<MultipleChoice state={BulletState} options={this.state.choices} maxActive={this.state.choices.length} containerClass="FormChoice" onUpdate={this.onGetResponse} />);
                break;
            case 'check box':
                answerItem = (<MultipleChoice state={CheckBoxState} options={this.state.choices} maxActive={this.state.maxCheckBox} containerClass="FormChoice" onUpdate={this.onGetResponse} />);
                break;
            case 'spinner':
                let onUpdateSpinner = function() {
                    this.onGetResponse(this.refs.spinner.value);
                    this.setState({
                        ...this.state,
                        'response': this.refs.spinner.value
                    });
                }

                onUpdateSpinner = onUpdateSpinner.bind(this);

                answerItem = (
                    <div>
                        <select value={this.state.response} onChange={onUpdateSpinner} onClick={onUpdateSpinner} ref="spinner">
                            { this.state.choices.map((text, index) => {
                                return (<option value={text} key={index}>{text}</option>)
                            }) }
                        </select>
                    </div>
                );
                break;
            default:
                answerItem = null;
        }

        let new_text = this.state.text.split("\n");

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
                    {(this.props.isEditable) ? (<button className="edit invisible square-round" onClick={this.onEditClick}>Edit</button>) : null}
                    {(this.props.isEditable) ? (<button className="bin invisible square-round" onClick={this.props.onDelete}>Bin</button>) : null}
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
            'isAdmin': this.props.isAdmin
        }
        this.resizeTextArea = this.resizeTextArea.bind(this);
        this.onAddQuestion = this.onAddQuestion.bind(this);
        this.onDeleteQuestion = this.onDeleteQuestion.bind(this);
        this.onGetResponse = this.onGetResponse.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
        this.onValidate = this.onValidate.bind(this);
        this.onSave = this.onSave.bind(this);
    }

    resizeTextArea(refName) {
        let textArea = this.refs[refName];
        textArea.style.height = 'auto';
        textArea.style.height = textArea.scrollHeight+'px';
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
        if(typeof(this.props.onSave) === "function") this.props.onSave(this.state.questions);
    }

    render() {
        return (
            <div className="basic-card-no-glow form card-width">
                <div className="top-color shade-blue"></div>
                <div className="top-bar">
                    EVENTNAME |
                </div>
                <p className="hr fullwidth" />
                {
                    this.state.questions.map((item, index) => {
                        return (
                            <QuestionItem key={index} isError={this.state.validateError.includes(index)} index={index} defaultText={item.question} type={item.type} choices={item.choices} onDelete={() => {this.onDeleteQuestion(index);}} isEditable={this.state.isAdmin} onGetResponse={this.onGetResponse} onChangeText={this.onChangeText} />
                        );
                    })
                }
                {
                    (this.state.isAdmin) ? (
                        <div className="flex flex-aligns-item flex-justify-center added-zone">
                            <span className="icon-plus big" />
                            <div className="question-type">
                                <button onClick={() => { this.onAddQuestion('short answer') }}>Add text answer</button>
                                <button onClick={() => { this.onAddQuestion('check box') }}>Add checkbox</button>
                                <button onClick={() => { this.onAddQuestion('bullet') }}>Add bullet point</button>
                                <button onClick={() => { this.onAddQuestion('spinner') }}>Add spinner</button>
                            </div>
                        </div>
                    ) : (<div>
                        <button onClick={this.onValidate}>Send</button>
                    </div>)
                }
                {
                    (this.state.isAdmin) ? (
                        <div>
                            <button onClick={this.onSave} >Save</button>
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
    onSent: (data) => { console.log(data); },
    onSave: (data) => { console.log(data); }
}

export default QuestionForm;
