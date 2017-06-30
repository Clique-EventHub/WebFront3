/* eslint-disable */

import React, { Component } from 'react';
import $ from 'jquery';
import '../../public/resource/slick-1.6.0/slick/slick.min.js';
import EventDetail from '../container/eventDetail';

class slickCarousel extends Component {
    constructor(props) {
        super(props);
        this.onItemClick = this.onItemClick.bind(this);
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
        this.props.onItemPopUpClick(<EventDetail />);
    }

    render() {
        let posterTest = [];
        for(var i = 1; i < 32; i++) {
            posterTest.push(`../../resource/images/poster_dummy/${i}.jpg`);
        }
        return (
            <div>
                <div className='myContainer'>
                    <div className='single-item'>
                        <div className="slick-slide-item" style={{backgroundImage: `url(${posterTest[2]})`}} onClick={this.onItemClick}></div>
                        <div className="slick-slide-item" style={{backgroundImage: `url(${posterTest[12]})`}} onClick={this.onItemClick}></div>
                        <div className="slick-slide-item" style={{backgroundImage: `url(${posterTest[24]})`}} onClick={this.onItemClick}></div>
                        <div className="slick-slide-item" style={{backgroundImage: `url(${posterTest[21]})`}} onClick={this.onItemClick}></div>
                        <div className="slick-slide-item" style={{backgroundImage: `url(${posterTest[25]})`}} onClick={this.onItemClick}></div>
                        <div className="slick-slide-item" style={{backgroundImage: `url(${posterTest[8]})`}} onClick={this.onItemClick}></div>
                    </div>
                </div>
            </div>
        );
    }
}

export default slickCarousel;
