/* eslint-disable */

import React, { Component } from 'react';
import $ from 'jquery';
import '../../public/resource/slick-1.6.0/slick/slick.min.js';
import EventDetail from '../container/eventDetail2';
import { getRandomShade } from '../actions/common';

class slickCarousel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            'imageLoad': (this.props.posters.map(() => { return true})),
            'imageColor': (this.props.posters.map(() => { return getRandomShade(); }))
        }
        this.onItemClick = this.onItemClick.bind(this);
        this.onImageError = this.onImageError.bind(this);
    }

    componentDidMount() {
        $(".single-item").slick({
        	dots: false,
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            focusOnSelect: true,
            draggable: true,
            autoplay: true,
            mobileFirst: true,
            autoplaySpeed: 2000,
            centerPadding: '60px',
            variableWidth: true,
            speed: 300,
            centerMode: true,
            variableWidth: true,
            arrows: false
        });
    }

    onItemClick() {
        this.props.onItemPopUpClick(<EventDetail onToggle={this.props.onToggle} onSetItem={this.props.onSetItem} />);
    }

    onImageError(index) {
        let new_imgLoad = this.state.imageLoad;
        new_imgLoad[index] = false;
        this.setState({
            ...this.state,
            'imageLoad': new_imgLoad
        });
    }

    render() {

        return (
            <div>
                <div className='myContainer'>
                    <div className='single-item'>
                        {
                            this.props.posters.map((src, index) => {
                                return (this.state.imageLoad[index]) ? (
                                    <div key={index} className="slick-slide-item" style={{backgroundImage: `url(${src})`}} onClick={this.onItemClick} />
                                ) : (
                                    <div key={index} className={`slick-slide ${this.state.imageColor[index]}`} onClick={this.onItemClick} />
                                );
                            })
                        }
                    </div>
                    {
                        this.props.posters.map((src, index) => {
                            return <img key={index} src={src} onError={() => {this.onImageError(index);}} style={{'visibility': 'hidden', 'position': 'absolute', 'top': '-9999px', 'left': '-9999px'}} />
                        })
                    }
                </div>
            </div>
        );
    }
}

slickCarousel.defaultProps = {
    posters: [
        `../../resource/images/poster_dummy/3.jpg`,
        `../../resource/images/poster_dummy/13.jpg`,
        `../../resource/images/poster_dummy/25.jpg`,
        `../../resource/images/poster_dummy/22.jpg`,
        `../../resource/images/poster_dummy/26.jpg`,
        `../../resource/images/poster_dummy/9.jpg`
    ]
}

export default slickCarousel;
