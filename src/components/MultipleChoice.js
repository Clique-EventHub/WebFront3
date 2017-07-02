import React, { Component } from 'react';
import CustomRadio from './CustomRadio';

class MultipleChoice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            active: {}
        }
        this.onSetActive = this.onSetActive.bind(this);
        this.onEvalBlock = this.onEvalBlock.bind(this);
    }

    onSetActive(index, new_mode) {
        let isActive = new_mode.type !== this.props.state[0].type;

        if(typeof(this.state.active[index]) !== "undefined" && this.state.active[index] !== null ) {
            if(!isActive) {
                let new_active = this.state.active;
                delete new_active[index];
                this.setState({
                    ...this.state,
                    'active': new_active
                })

                if(typeof(this.props.onUpdate) === "function") {
                    let response = [];
                    Object.keys(new_active).forEach((key) => {
                        response.push({
                            'index': key,
                            'value': new_active[key],
                            'text': this.props.options[index]
                        })
                    })
                    this.props.onUpdate(response);
                }
                return true;
            }
        }

        if(Object.keys(this.state.active).length <= this.props.maxActive) {
            let new_active = this.state.active;
            new_active[index] = new_mode.value;
            this.setState({
                ...this.state,
                'active': new_active
            })

            if(typeof(this.props.onUpdate) === "function") {
                let response = [];
                Object.keys(new_active).forEach((key) => {
                    response.push({
                        'index': key,
                        'value': new_active[key],
                        'text': this.props.options[key]
                    })
                })
                this.props.onUpdate(response);
            }
            return true;
        }

        if(typeof(this.props.onUpdate) === "function") {
            let response = [];
            Object.keys(this.state.active).forEach((key) => {
                if(key !== String(index)) {
                    response.push({
                        'index': key,
                        'value': this.state.active[key],
                        'text': this.props.options[key]
                    })
                } else {
                    response.push({
                        'index': key,
                        'value': new_mode.value,
                        'text': this.props.options[key]
                    })
                }
            })
            this.props.onUpdate(response);
        }
        return false;
    }

    onEvalBlock(index) {
        if(Object.keys(this.state.active).length < this.props.maxActive) return false;
        if(typeof(this.state.active[index]) === "string") return false;
        return true;
    }

    componentDidUpdate() {
        // console.log(this.props.options);
    }

    render() {
        return (
            <div className={(this.props.containerClass) ? (this.props.containerClass) : ''}>
                {
                    this.props.options.map((text, index) => {
                        return (
                            <div key={index}>
                                <CustomRadio key={index} text={text} state={this.props.state} isBlockedAction={
                                    this.onEvalBlock(index)
                                } onClick={(new_mode) => {
                                    this.onSetActive(index, new_mode);
                                }} color={this.props.color} colorHover={this.props.colorHover} colorActive={this.props.colorActive} />
                                {this.props.additionalButton}
                            </div>
                        );
                    })
                }
            </div>
        );
    }
}

export default MultipleChoice;
