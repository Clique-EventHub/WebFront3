import React, { Component } from 'react';
import './css/channelDetail.css';
import Image from '../components/Image';
import axios from 'axios';
import { hostname } from '../actions/index';
import ReactLoading from 'react-loading';
import _ from 'lodash';

class channelDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            'name': "",
            'picture': "",
            'detail': [""],
            'picture_large': [],
            'isLoad': false
        }
    }

    componentWillMount() {
        axios.get(`${hostname}channel?id=${"595ef6b8822dbf0014cb821b"}`).then((data) => {
            console.log("get!!!dd");
            console.log(JSON.stringify(data.data.name))
            this.setState({
                'name': data.data.name,
                'picture': data.data.picture,
                'detail': [
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec interdum eros purus, eu suscipit lorem eleifend eget. Pellentesque a finibus felis. Pellentesque quis neque ut dui finibus iaculis. Fusce ac placerat',
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec interdum eros purus, eu suscipit lorem eleifend eget. Pellentesque a finibus felis. Pellentesque quis neque ut dui finibus iaculis. Fusce ac placerat'
                    ],
                'picture_large': _.get(data, 'data.picture_large', []),
                'isLoad': true
            });
        }, (error) => {
            console.log("get channel error");
        });
    }



    onExit() {
        this.props.onToggle();
    }

    render () {
        // console.log(this.state.picture_large);
        const content = (this.state.isLoad) ? (
            <section>
                <div className="flex">
                    <Image src={this.state.picture} imgClass="chan-img" rejectClass="chan-img" />
                    <div className="side-style">
                        <h2 className="chan-name">{this.state.name}</h2>
                        <button className="bt-fol" alt="btn-follow">FOLLOW</button>
                    </div>
                </div>
                <p className="l1"></p>
                <div className="event-bio">
                    <h3 className="display-none">Bio</h3>
                    {
                        (this.state.detail.constructor === Array) ?
                        this.state.detail.map((text, index) => <p key={index}>{text}</p>) : (<p>{this.state.detail}</p>)
                    }
                </div>
                <div className="marginleft">
                    <div className="chan-img-slide">
                        {
                            this.state.picture_large.map((url, index) => {
                                return <a href={url} key={index}><Image src={url} rejectClass="img-fallback" /></a>
                            })
                        }
                    </div>
                    <a href="#" className="box">
                        FACEBOOK
                        <div>www.facebook.com</div>
                    </a>
                    <a href="#" className="box">
                        YOUTUBE
                        <div>www.youtube.com</div>
                    </a>
                </div>
            </section>
        ) : (
            <div style={{'fontSize': '30px', 'margin': 'auto', 'color': '#878787', 'textAlign': 'center'}}>
                <div style={{'margin': 'auto', 'width': '50px', 'display': 'inline-block', 'position': 'relative', 'top': '12px', 'marginLeft': '5px'}}>
                    <ReactLoading type={'bars'} color={'#878787'} height='40px' width='40px' />
                </div>
                Loading
                <div style={{'margin': 'auto', 'width': '50px', 'display': 'inline-block', 'position': 'relative', 'top': '12px', 'marginLeft': '5px'}}>
                    <ReactLoading type={'bars'} color={'#878787'} height='40px' width='40px' />
                </div>
            </div>
        )

        return (
            <div className="modal-container">
                <article className="edit-event basic-card-no-glow modal-main card-width channel-detail">
                    <button className="card-exit invisible square-round" role="event-exit" onClick={this.onExit.bind(this)}>
                        <img src="../../resource/images/X.svg" />
                    </button>
                    {
                        content
                    }
                </article>
                <div className="background-overlay"/>
            </div>

        )

    }
}

export default channelDetail;
