/* eslint-disable */

import React, { Component } from 'react';
import $ from 'jquery';
import autoBind from '../hoc/autoBind';

class editChannel extends Component {
    // constructor(props) {
    //     super(props);
    // }

    componentDidMount() {
        $(document).ready(setTimeout(function() {
            if($(window).width() > 768) {
                $('.top-moving').css('height', $('.event-poster').children().height() + 20);
                if($('.event-detail').css('padding-top').replace('px','') > 40) $('.event-detail').css('padding-top', '40px');
                if($('.event-detail').css('padding-left').replace('px','') > 29) $('.event-detail').css('padding-left', '29px');
            }
            else {
                $('.top-moving').css('height', 'initial');
                $('.event-detail').css('padding', '');
            }
        }, 10));

        $(window).resize(function() {
            if($(window).width() > 768) {
                $('.top-moving').css('height', $('.event-poster').children().height() + 20);
                if($('.event-detail').css('padding-top').replace('px','') > 40) $('.event-detail').css('padding-top', '40px');
                if($('.event-detail').css('padding-left').replace('px','') > 29) $('.event-detail').css('padding-left', '29px');
            }
            else {
                $('.top-moving').css('height', 'initial');
                $('.event-detail').css('padding', '');
            }
        })
    }

    onExit() {
        this.props.toggle_pop_item();
    }

    componentWillUnmount() {
        $(window).unbind('resize');
    }

    render() {
        return (
            <div>
                <div className="background-overlay" />
                <article className="event-detail basic-card-no-glow">
                    <button className="invisible square-round" role="event-exit" onClick={this.onExit.bind(this)}>
                        <img src="../../resource/images/X.svg" />
                    </button>
                    <div>
                        ssdfsdsfsdf
                    </div>
                    <p className="hr"></p>
                    <div className="event-bio">
                        <h3 className="display-none">Bio</h3>
                        <p>     Event Detail  Event Detail Event Detail Event Detail Event Detail
                        Event Detail  Event Detail Event Detail Event Detail Event Detail
                        Event Detail  Event Detail Event Detail Event Detail Event Detail
                        Event Detail  Event Detail Event Detail Event Detail Event Detail
                        Event Detail  Event Detail Event Detail Event Detail Event Detail
                        Event Detail  Event Detail Event Detail Event Detail Event Detail
                        Event Detail  Event Detail Event Detail Event Detail Event Detail
                        </p>
                    </div>
                </article>
            </div>
        );
    }
}

export default autoBind(editChannel);
