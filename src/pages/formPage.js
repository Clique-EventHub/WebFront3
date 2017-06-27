import React, { Component } from 'react';
import pages from '../hoc/pages';
import normalPage from '../hoc/normPage';
import QuestionForm from '../components/questionForm';

const testQuestion = [
    {
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
        'choices': ['Yes', 'No', 'I Don\'t Know']
    }, {
        'question': 'Some Text Answer Question',
        'type': 'short answer',
        'choices': null
    }, {
        'question': 'What is you favourite colour?',
        'type': 'spinner',
        'choices': ["White", "Black", "Pink", "Red", "Green", "Blue", "Yellow", "Purple"]
    }
]

class formPage extends Component {

    render() {
        return (
            <section role="main-content" >
                <QuestionForm questions={testQuestion} isAdmin={false} />
            </section>
        );
    }
}

export default normalPage(pages(formPage, true));
