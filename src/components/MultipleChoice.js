import React, { Component } from 'react';
import CustomRadio from './CustomRadio';
import _ from 'lodash';

class MultipleChoice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            active: {},
            isLoad: false
        }
        this.onSetActive = this.onSetActive.bind(this);
        this.onEvalBlock = this.onEvalBlock.bind(this);
        this.onLoad = this.onLoad.bind(this);

        if(this.props.isLoad) {
            setTimeout(() => this.onLoad(), 0);
        }
    }

    onLoad() {
        this.setState((prevState, props) => {
            return {
                ...prevState,
                active: this.props.initialValue,
                isLoad: true
            }
        })
    }

    componentWillUpdate(nextProps, nextState) {
        if(nextProps.isLoad && !this.state.isLoad) {
            this.onLoad();
        }
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
        console.log(this.state);
    }

    render() {
        return (
            <div className={(this.props.containerClass) ? (this.props.containerClass) : ''}>
                {
                    this.props.options.map((text, index) => {
                        return (
                            <div key={index}>
                                <CustomRadio
                                    key={index}
                                    text={text}
                                    state={this.props.state}
                                    isBlockedAction={
                                        this.onEvalBlock(index)
                                    }
                                    onClick={(new_mode) => {
                                        this.onSetActive(index, new_mode);
                                    }}
                                    color={this.props.color}
                                    colorHover={this.props.colorHover}
                                    colorActive={this.props.colorActive}
                                    isLoad={this.props.isLoad}
                                    initialValue={_.get(this.props.initialValue, index, this.props.state[0].value)}
                                />
                                {this.props.additionalButton}
                            </div>
                        );
                    })
                }
            </div>
        );
    }
}

MultipleChoice.defaultProps = {
    initialValue: {},
    isLoad: true,
    onUpdate: (res) => { console.log(res);}
}

export default MultipleChoice;
