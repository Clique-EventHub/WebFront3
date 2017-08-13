import React, { Component } from 'react';
import { checkYoutubeUrl } from '../actions/common';
import _ from 'lodash';

const youtube_regex = /^.*(youtu\.be\/|vi?\/|u\/\w\/|embed\/|\?vi?=|\&vi?=)([^#\&\?]*).*/;

function parseId(url) {
    return _.get(url.match(youtube_regex), '[2]', null);
}

class VideoIframe extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isExist: false
        }
        this.checkExist = this.checkExist.bind(this);
    }

    checkExist(props) {
        const url = _.get(props, 'src', '');
        checkYoutubeUrl(parseId(url)).then((data) => {
            if(this._isMounted) {
                this.setState((prevState) => {
                    return ({
                        ...prevState,
                        isExist: data
                    });
                })
            }
        })
    }

    componentWillMount() {
        this.checkExist(this.props);
        this._isMounted = true;
    }

    componentWillReceiveProps(nextProps) {
        this.checkExist(nextProps);
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        const url = _.get(this.props, 'src', '');
        const afterRender = _.get(this.props, 'afterRender', []);
        if(!this.state.isExist) return <div />;
        return (
            <div>
                <div style={{
                        'position': 'relative',
                        'width': '100%',
                        'height': '0px',
                        'paddingBottom': '51%'
                    }}>
                    <iframe allowFullScreen='allowFullScreen' style={{
                            'position': 'absolute',
                            'width': '100%',
                            'height': '100%',
                            'left': '0px',
                            'top': '0px'
                        }} src={url} />
                </div>
                {afterRender}
            </div>
        );
    }
}

export default VideoIframe;
