import React, { Component } from 'react';
// import * as FormFunc from './auxlillaryForm';
import MultipleChoice from './MultipleChoice';
import './style/questionForm.css';

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

class QuestionForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            'questions': [{
                'question': 'Some Text Answer Question',
                'type': 'short answer',
                'choices': null
            }, {
                'question': 'Some Bullet Point Question',
                'type': 'bullet',
                'choices': ['ABC', 'DEF', 'GHI']
            }, {
                'question': 'Some Checkbox Question',
                'type': 'check box',
                'choices': ['Happy', 'At the', 'Speed Of', 'Light']
            }, {
                'question': 'Is there a difference between Checkbox Question and Spinner Question?',
                'type': 'spinner',
                'choices': ['Yes', 'No', 'I Don\'t Know', 'Fuck You']
            }, {
                'question': 'Some Text Answer Question',
                'type': 'short answer',
                'choices': null
            }],
            'questionResponse': [{
                'answer': null
            }]
        }
        this.resizeTextArea = this.resizeTextArea.bind(this);
    }

    resizeTextArea(refName) {
        let textArea = this.refs[refName];
        textArea.style.height = 'auto';
        textArea.style.height = textArea.scrollHeight+'px';
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
                        let answerItem;
                        switch (item.type) {
                            case 'short answer':
                                answerItem = (<textarea ref={`item-${index}`} onKeyUp={() => {this.resizeTextArea(`item-${index}`); }}/>);
                                break;
                            case 'bullet':
                                answerItem = (<MultipleChoice state={BulletState} options={item.choices} maxActive={3} containerClass="FormChoice" additionalButton={<button className="invisible to-right" onClick={() => {console.log("Clicked");}}>X</button>} />);
                                break;
                            case 'check box':
                                answerItem = (<MultipleChoice state={CheckBoxState} options={item.choices} maxActive={1} containerClass="FormChoice" additionalButton={<button className="invisible to-right" onClick={() => {console.log("Clicked");}}>X</button>} />);
                                break;
                            case 'spinner':
                                answerItem = (
                                    <div>
                                        <input className="list" list={`question-${index}`} />
                                        <datalist id={`question-${index}`}>
                                            { item.choices.map((text, index) => {
                                                return (<option value={text} key={index} />)
                                            }) }
                                        </datalist>
                                        <div className="list-choices">
                                            {item.choices.map((item, index) => {
                                                return (<span>{index + 1}. {item}</span>)
                                            })}
                                        </div>
                                    </div>
                                );
                                break;
                            default:
                                answerItem = null;
                        }

                        return (
                            <div className="question-item fullwidth">
                                <button className="bin invisible square-round">Bin</button>
                                <p>{item.question}</p>
                                { answerItem }
                                { (item.type !== 'short answer') ? (
                                    <div><input type="text" /><span className="icon-plus" /></div>
                                ) : null }
                            </div>
                        );
                    })
                }
                <div className="flex flex-aligns-item flex-justify-center added-zone">
                    <span className="icon-plus big" />
                    <div className="question-type">
                        <button>Add text answer</button>
                        <button>Add checkbox</button>
                        <button>Add bullet point</button>
                        <button>Add spinner</button>
                    </div>
                </div>
            </div>
        );
    }
}

// <MultipleChoice state={BulletState} options={[
//         'Hello 1',
//         'Hello 2',
//         'Hello 3',
//         'Hello 4',
//         'Hello 5'
//     ]} maxActive={5} color="#000" onUpdate={(res) => {
//         // res.forEach((item) =>  console.log(item))
//     }}  />

export default QuestionForm;
