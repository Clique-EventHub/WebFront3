/* eslint-disable */

import React, { Component } from 'react';
import $ from 'jquery';
import '../../public/resource/slick-1.6.0/slick/slick.min.js';
import EventDetail from '../container/eventDetail2';
import { getRandomShade, getEvent } from '../actions/common';
import _ from 'lodash';
import Slider from 'react-slick';

const defaultAmount = 4;

const Settings = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    focusOnSelect: true,
    draggable: true,
    autoplay: true,
    autoplaySpeed: 2000,
    centerPadding: '0px',
    variableWidth: true,
    speed: 300,
    centerMode: true,
    arrows: false
};

class slickCarousel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            'imageColor': Array.apply(null, {length: defaultAmount}).map(Function.call, Number).map(() => { return getRandomShade(); }),
            'imageLoad': Array.apply(null, {length: defaultAmount}).map(Function.call, Number).map(() => { return true }),
            'eventDatas': [],
            'eventDataLoad': false
        }
        this.onItemClick = this.onItemClick.bind(this);
        this.onImageError = this.onImageError.bind(this);
    }

    // componentDidUpdate() {
    //     let items = $('.slick-slide');
    //     items.on('touchstart mousedown', start);
    //
    //     function start(event) {
    //         event.preventDefault();
    //
    //         for(let index = 0; index < items.length; index++) {
    //             $(items[index]).on('click', () => {
    //                 this.onItemClick(Number(index))
    //             }); // Turn on click events
    //             $(items[index]).on('touchmove mousemove', move);
    //             $(items[index]).on('touchend mouseup', () => {});
    //         }
    //         return false;
    //     }
    //
    //     function move(event) {
    //         items.off('click');
    //         return false;
    //     }
    // }

    componentWillReceiveProps(nextProps) {
        if(nextProps.isLoad && !this.props.isLoad) {
            let promises = [];
            _.get(nextProps, 'eventIds', []).forEach((id) => {
                promises.push(getEvent(id, false).then((data) => {
                    this.setState((prevState) => {
                        return {
                            ...prevState,
                            eventDatas: prevState.eventDatas.concat([data])
                        }
                    })
                    return true;
                }));
            });
            const eventIds = nextProps.eventIds;
            let newImgColor = this.state.imageColor;
            if(eventIds.length < newImgColor.length) newImgColor = newImgColor.slice(0, eventIds.length);
            else if(eventIds.length > newImgColor.length) newImgColor = newImgColor.concat(Array.apply(null, {length: (eventIds.length - newImgColor.length)}).map(Function.call, Number).map(() => getRandomShade()))

            this.setState((prevState) => {
                return ({
                    ...prevState,
                    imageColor: this.props.eventIds.map(() => getRandomShade())
                });
            })

            Promise.all(promises).then((datas) => {
                this.setState((prevState) => {
                    return {
                        ...prevState,
                        'eventDataLoad': true,
                        'imageLoad': Array.apply(null, {length: defaultAmount}).map(Function.call, Number).map(() => { return true; })
                    }
                });
            }).catch(() => {
                this.setState((prevState) => {
                    return {
                        ...prevState,
                        'eventDataLoad': true,
                        'imageLoad': Array.apply(null, {length: defaultAmount}).map(Function.call, Number).map(() => { return true; })
                    }
                });
            })
        }
    }

    onItemClick(index) {
        this.props.onItemPopUpClick(<EventDetail onToggle={this.props.onToggle} onSetItem={this.props.onSetItem} eventId={this.props.eventIds[index]}/>);
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
        if(this.props.isLoad && this.state.eventDataLoad && _.get(this.state, 'eventDatas', []).length !== 0) {
            let eventDatas = _.get(this.state, 'eventDatas', []);
            let tmp = eventDatas;
            if (eventDatas.length < 4) {
                eventDatas = eventDatas.concat(tmp);
            }
            return (
                <div>
                    <div className='myContainer'>
                        <Slider {...Settings} className='single-item'>
                            {
                                eventDatas.map((item, index) => {
                                    const obj = (_.get(item, 'picture', '') !== '' && this.state.imageLoad[index%tmp.length]) ? (
                                        <div
                                            key={index}
                                            className="slick-slide-item"
                                            style={{
                                                'backgroundImage': `url('${_.get(item, 'picture', '')}')`
                                            }}
                                            onClick={() => this.onItemClick(Number(index%tmp.length))}
                                        />
                                    ) : (
                                        <div
                                            key={index}
                                            className={`slick-slide ${this.state.imageColor[index%tmp.length]}`}
                                            onClick={(e) => {
                                                this.onItemClick(index%tmp.length)
                                            }}
                                        />
                                    );

                                    return obj;
                                })
                            }
                        </Slider>
                        {
                            tmp.map((item, index) => {
                                return <img key={index} src={_.get(item, 'picture', '')} onError={() => {this.onImageError(index);}} style={{'visibility': 'hidden', 'position': 'absolute', 'top': '-9999px', 'left': '-9999px'}} />
                            })
                        }
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    <div className='myContainer'>
                        <Slider {...Settings} className='single-item'>
                            {
                                Array.apply(null, {length: defaultAmount}).map(Function.call, Number).map((item, index) => {
                                    return (
                                        <div key={index} className={`slick-slide ${this.state.imageColor[index]}`} />
                                    );
                                })
                            }
                        </Slider>
                    </div>
                </div>
            );
        }
    }
}

slickCarousel.defaultProps = {
    eventIds: [],
    isLoad: true
}

/*
posters: [
    `../../resource/images/poster_dummy/3.jpg`,
    `../../resource/images/poster_dummy/13.jpg`,
    `../../resource/images/poster_dummy/25.jpg`,
    `../../resource/images/poster_dummy/22.jpg`,
    `../../resource/images/poster_dummy/26.jpg`,
    `../../resource/images/poster_dummy/9.jpg`
]
*/

export default slickCarousel;
