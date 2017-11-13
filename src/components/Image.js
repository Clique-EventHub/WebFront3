import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getRandomShade } from '../actions/common';

class Image extends Component {
    constructor(props) {
        super(props);
        this.state = {
            'isExist': true,
            'defaultColor': getRandomShade()
        }
        this.onError = this.onError.bind(this);
    }

    onError() {
        this.setState({
            ...this.state,
            'isExist': false
        })
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.src !== this.props.src) {
            this.setState({
                ...this.state,
                'isExist': true
            })
        }
    }

    render() {
        return (this.state.isExist) ? (
            <img src={this.props.src !== null ? this.props.src : ''} onError={this.onError} className={(this.props.imgClass) ? this.props.imgClass : ''} {...this.props.imgOption} alt={this.props.alt} />
        ) : (
                <div className={`${(this.props.rejectClass) ? this.props.rejectClass : ''} ${this.state.defaultColor}`} {...this.props.rejectOption} alt={this.props.alt} />
        );
    }
}

Image.defaultProps = {
    'src': ''
}

Image.PropTypes = {
    'rejectClass': PropTypes.string,
    'rejectOption': PropTypes.object,
    'src': PropTypes.string.isRequired,
    'imgClass': PropTypes.string,
    'imgOption': PropTypes.object,
    'alt': PropTypes.string
}

export default Image;
