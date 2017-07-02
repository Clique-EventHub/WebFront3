import React, { Component } from 'react';
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

    render() {
        return (this.state.isExist) ? (
            <img src={this.props.src} onError={this.onError} className={(this.props.imgClass) ? this.props.imgClass : ''} {...this.props.imgOption} />
        ) : (
            <div className={`${(this.props.rejectClass) ? this.props.rejectClass : ''} ${this.state.defaultColor}`} {...this.props.rejectOption} />
        );
    }
}

Image.defaultProps = {
    'src': ''
}

export default Image;
