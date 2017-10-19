import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import _ from 'lodash';

const CustomRadioStyled = styled.div`
    display: inline-flex;
    justify-content: left;
    align-items: center;
    font-family: sans-serif;
    position: relative;
    font-family: "Century Gothic", CenturyGothic, Muli, AppleGothic, sans-serif;
    border-color: ${props => props.color};
    color: ${props => props.color};
    
    label:after {
        background-color: ${props => props.color};
        border-color: ${props => props.color};
    }

    &.active {
        border-color: ${props => props.colorActive} !important;
        color: ${props => props.colorActive} !important;

        label:after {
            background-color: ${props => props.colorActive} !important;
            border-color: ${props => props.colorActive};
        }
    }

    &:hover {
        border-color: ${props => props.colorHover};
        color: ${props => props.colorHover};

        label:after {
            background-color: ${props => props.colorHover};
            border-color: ${props => props.colorHover};
        }
    }

    &.no-line {
        display: flex;
    }

    input[type="radio"] {
        display: none;

        &~label {
            display: inline-block;
            vertical-align: text-bottom;
            vertical-align: bottom;
            font-size: calc(1.3rem);
            line-height: 1.3rem;

            &:before {
                content: " ";
                width: 1.3rem;
                height: 1.3rem;
                float: left;
                display: inline-block;
                border-radius: 3px;
                border: 1px solid;
                margin-right: 5px;
                vertical-align: middle;
                box-sizing: border-box;
                overflow: hidden;
                font-family: "Century Gothic", CenturyGothic, Muli, AppleGothic, sans-serif;
            }
        }

        &~div[data-role='spare'] {
            display: inline-block;
            height: 1.3rem;
        }

        &.state-none ~ label:before {
            content: " ";
        }

        &.state-circle ~ label:after {
            content: " ";
            height: 0.5em;
            width: 0.5em;;
            display: block;
            position: absolute;
            border-radius: 50%;
            top: 0px;
            left: 0px;
            transform: translate(0.325rem, 0.325rem);
        }

        &.state-full ~ label:after {
            content: " ";
            height: 1.3rem;
            width: 1.3rem;
            border-radius: 3px;
            display: block;
            position: absolute;
            top: 0px;
            left: 0px;
        }

        &.state-square {
            &~label {
                &:after {
                    content: " ";
                    height: 0.5em;
                    width: 0.5em;;
                    display: block;
                    position: absolute;
                    top: 0px;
                    left: 0px;
                    transform: translate(0.325rem, 0.325rem);
                }

                &:before {
                    content: " ";
                }
            }
        }

        &.state-triangle ~ label:after {
            content: " ";
            height: 0rem;
            width: 0rem;;
            display: block;
            position: absolute;
            top: 0px;
            left: 0px;
            transform: translate(0.325rem, 0.2rem);
            border-top: 0.4rem solid transparent;
            border-bottom: 0.4rem solid transparent;
            border-left: 0.7rem solid;
            background-color: transparent;
        }
    }
`;

function isExist(obj) {
    return (typeof (obj) !== "undefined" && obj !== null);
}

class CustomRadio extends Component {
    constructor(props) {
        super(props);
        this.state = {
            'mode': 0,
            'color': (this.props.color) ? this.props.color : '#000',
            'colorHover': (this.props.colorHover) ? this.props.colorHover : '#000',
            'colorActive': (this.props.colorActive) ? this.props.colorActive : '#000',
            'active': false,
            'state': this.props.state,
            'isLoad': false
        }
        this.onClick = this.onClick.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        if (this.props.isLoad) {
            setTimeout(() => {
                this.setState({
                    ...this.state,
                    isLoad: true
                })
            }, 0);
        }
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
        if (nextProps.isLoad && !this.state.isLoad) {
            let initialMode = 0;

            this.state.state.forEach((item, index) => {
                if (item.value === this.props.initialValue) {
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

    onClick(e) {
        if (this.props.isBlockedAction) return;
        let new_mode = (this.state.mode + 1) % this.state.state.length;

        //logic here
        if (isExist(this.props.onClick) && typeof (this.props.onClick) === "function") this.props.onClick({ ...this.state.state[new_mode], text: this.props.text });

        this.setState({
            ...this.state,
            'mode': new_mode
        })
    }

    render() {
        if (this.state.state.length <= 1) return null;
        if (this.props.text.length <= 0) return <div></div>;

        return (
            <CustomRadioStyled
                color={this.props.color}
                colorHover={this.props.colorHover}
                colorActive={this.props.colorActive}
                className={`${this.props.addedClass ? (this.props.addedClass) : ''} ${(this.state.active) ? 'active' : ''} ${(this.props.isInline) ? '' : 'no-line'}`}
                onClick={this.onClick}
                onMouseDown={this.onMouseDown}
                onMouseUp={this.onMouseUp}
                style={_.get(this.props, 'style', {})}
            >
                <input className={`state-${this.state.state[this.state.mode].type}`} type="radio" value={this.state.state[this.state.mode].value} checked={this.state.mode !== 0} name="mode-option" />
                <div data-role="spare" />
                <label>{this.props.text}</label>
            </CustomRadioStyled>
        );
    }
}

CustomRadio.PropTypes = {
    'state': PropTypes.arrayOf(PropTypes.shape({
        'type': PropTypes.string,
        'value': PropTypes.any
    })).isRequired,
    'text': PropTypes.string.isRequired,
    'color': PropTypes.string,
    'colorHover': PropTypes.string,
    'colorActive': PropTypes.string,
    'isLoad': PropTypes.bool.isRequired,
    'initValue': PropTypes.string.isRequired,
    'onClick': PropTypes.func,
    'isInline': PropTypes.bool,
    'addedClass': PropTypes.string
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
        }],
    'isInline': true,
    'text': 'No Text',
    'color': '#878787',
    'colorHover': '#AAA',
    'colorActive': '#777',
    'isLoad': true,
    'initialValue': 'state-0',
    'onClick': (data) => { console.log(data) }
}

export default CustomRadio;
