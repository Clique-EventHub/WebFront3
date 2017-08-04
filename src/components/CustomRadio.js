import React, { Component } from 'react';
import './style/CustomRadio.css';

function isExist(obj) {
    return (typeof(obj) !== "undefined" && obj !== null);
}

class CustomRadio extends Component {
    constructor(props) {
        super(props);
        this.state = {
            'mode': 0,
            'color': (this.props.color) ? this.props.color : '#000',
            'colorHover': (this.props.colorHover) ? this.props.colorHover : '#000',
            'colorActive': (this.props.colorActive) ? this.props.colorActive : '#000',
            'hovered': false,
            'active': false,
            'state': this.props.state,
            'isLoad': false
        }
        this.onClick = this.onClick.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.style = this.style.bind(this);
        if(this.props.isLoad) {
            setTimeout(() => {
                this.setState({
                    ...this.state,
                    isLoad: true
                })
            }, 0);
        }
    }

    onMouseOver() {
        this.setState({
            ...this.state,
            'hovered': true
        })
    }

    onMouseOut() {
        this.setState({
            ...this.state,
            'hovered': false
        })
    }

    onMouseDown() {
        this.setState({
            ...this.state,
            'active': true
        })
    }

    onMouseUp() {
        this.setState({
            ...this.state,
            'active': false
        })
    }

    componentWillUpdate(nextProps, nextState) {
        if(nextProps.isLoad && !this.state.isLoad) {
            let initialMode = 0;

            this.state.state.forEach((item, index) => {
                if(item.value === this.props.initialValue) {
                    initialMode = index;
                }
            });
            this.setState((prevState) => {
                return {
                    ...prevState,
                    mode: initialMode,
                    isLoad: nextProps.isLoad
                }
            });
        }
    }

    style() {
        if(this.state.active) {
            return ({
                'borderColor': this.state.colorActive,
                'color': this.state.colorActive
            })
        }
        else if(this.state.hovered) {
            return ({
                'borderColor': this.state.colorHover,
                'color': this.state.colorHover
            })
        } else {
            return ({
                'borderColor': this.state.color,
                'color': this.state.color
            });
        }
    }

    onClick() {
        if(this.props.isBlockedAction) return;
        let new_mode = (this.state.mode + 1)%this.state.state.length;

        //logic here
        if(isExist(this.props.onClick) && typeof(this.props.onClick) === "function") this.props.onClick({...this.state.state[new_mode], text: this.props.text});

        this.setState({
            ...this.state,
            'mode': new_mode
        })
    }

    render() {
        if(this.state.state.length <= 1) return null;
        if(this.props.text.length <= 0) return <div></div>;

        return (
            <div className={`CustomRadio ${(this.props.addedClass) ? this.props.addedClass : ''}`} onClick={this.onClick} style={this.style()} onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut} onMouseDown={this.onMouseDown} onMouseUp={this.onMouseUp}>
                <input className={`state-${this.state.state[this.state.mode].type}`} type="radio" value={this.state.state[this.state.mode].value} checked={this.state.mode !== 0} name="mode-option" />
                <div data-role="spare" />
                <label>{this.props.text}</label>
            </div>
        );
    }
}

CustomRadio.defaultProps = {
    'state': [
    {
        'type': 'none',
        'value': 'state-0'
    }, {
        'type': 'circle',
        'value': 'state-1'
    }, {
        'type': 'square',
        'value': 'state-2'
    }, {
        'type': 'triangle',
        'value': 'state-3'
    }, {
        'type': 'diamond',
        'value': 'state-4'
    }],
    'text': 'No Text',
    'color': '#878787',
    'colorHover': '#AAA',
    'colorActive': '#BBB',
    'isLoad': true,
    'initialValue': 'state-0',
    'onClick': (data) => {console.log(data)}
}

export default CustomRadio;
