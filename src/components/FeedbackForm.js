import React, { Component } from 'react';
import MultipleChoice from '../components/MultipleChoice';
import Rating from 'react-rating'

const states =
[{
    'type': 'none',
    'value': 'none'
}, {
    'type': 'square',
    'value': 'checked'
}];

const list = ["BUG(S) REPORT", "OPINION"];

class FeedbackForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            'header': '',
            'text': '',
            'validate': [true, true, true],
            'choices': []
        }
        this.onChange = this.onChange.bind(this);
    }

    onChange(e, location) {
        let new_state = { ...this.state };
        new_state[location] = e.target.value;
        this.setState({ ...new_state });
        this.resizeTextArea();
    }

    resizeTextArea() {
        let textArea = document.getElementById("description");
        textArea.style.height = 'auto';
        textArea.style.height = textArea.scrollHeight+'px';
    }

    formValidation() {
        const { choices, header, text } = this.state;
        let validate = [true, true, true];
        if(choices.length === 0) validate[0] = false;
        if(header.length === 0) validate[1] = false;
        if(text.length === 0) validate[2] = false;
        if(validate[0] & validate[1] & validate[2]) {
            //Sent
        }
        this.setState({ ...this.state, validate });
    }

    onSubmit(e) {
        e.preventDefault();
        this.formValidation.bind(this)();
        return false;
    }

    render() {
        const state = this.state;
        return (
            <form onSubmit={this.onSubmit.bind(this)} className="form basic-card-no-glow" style={{'fontSize': '17px'}}>
                <fieldset className={`form-group ${state.validate[1] ? 'form-success' : 'form-error'}`}>
                    <div className="flex">
                        <label htmlFor="header" >Header: </label>
                        <input id="header" type="text" placeholder="What is it about?" className="form-control" onChange={(e) => {this.onChange(e, "header")}} value={this.state.header} />
                    </div>
                </fieldset>
                <fieldset style={(state.validate[0] ? {'color': '#4caf50'} : {'color': '#f44336'})}>
                    <span>What type of feedback is it about?</span>
                    <div style={{'marginLeft': '10px'}}>
                        <MultipleChoice state={states} options={list} maxActive={1} containerClass="FormChoice circle" onUpdate={(val) => { this.setState({...state, 'choices': val})}} />
                        <div className="help-block">Pick 1</div>
                    </div>
                </fieldset>
                <fieldset className={`form-group form-textarea ${state.validate[2] ? 'form-success' : 'form-error'}`}>
                    <label htmlFor="description">Description: </label>
                    <textarea id="description" placeholder="Detail here" className="form-control" onChange={(e) => {this.onChange(e, "text")}} value={this.state.text}></textarea>
                </fieldset>
                <hr />
                <Rating />
                <hr />
                <div className="form-action">
                    <button onClick={this.onSubmit.bind(this)} type="button" className="btn btn-primary btn-block">Submit</button>
                </div>
            </form>
        );
    }
}

export default FeedbackForm;
