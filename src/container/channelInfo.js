import React, { Component } from 'react';
import './css/eventDetail2.css'

let isSet = false;
//https://codepen.io/bh/pen/JBlCc

class channelInfo extends Component {

    onExit() {
        this.props.onToggle();
    }

    render() {

        let eventName = (
            <div className="event-name">
                <h2>Event Name</h2>
                <div><img alt="channel-icon" /> Channel Name</div>
            </div>
        );

        return (
            <div className="modal-container">
                <article className="event-detail-fix basic-card-no-glow">
                    <button className="invisible square-round" role="event-exit" onClick={this.onExit.bind(this)}>
                        <img src="../../resource/images/X.svg" />
                    </button>
                    <div className="top-moving">
                        <div className="toggle">
                            {eventName}
                        </div>
                        <div className="event-poster-fix">
                            <div>
                                <img src="../../resource/images/poster_dummy/10.jpg" alt="main-poster" />
                                <div className="tags-container"><img alt="tag-icon" /><img alt="tag-icon" /><img alt="tag-icon" /></div>
                            </div>
                        </div>
                        <div className="column">
                            <div className="toggle-not">
                                {eventName}
                            </div>
                            <div className="event-info">
                                <div className="share-interest-join" aria-hidden="true">
                                    <div className="float-left"><i className="fa fa-share-square-o" aria-hidden="true"></i> SHARE</div>
                                    <div className="to-right" >
                                        <button alt="btn-interest">INTEREST</button>
                                        <button alt="btn-join">JOIN</button>
                                    </div>
                                </div>
                                <div className="number-join">
                                <p className="hr"></p>
                                and 250 people join this
                                <p className="hr"></p>
                                </div>
                                <div className="sub-detail">
                                    <p className="only-fac"><strong>*</strong> For <strong>Engineering student</strong> only</p>
                                    <p><strong>*</strong> 16:00 - 20:00 | 30 - 31 January 2017</p>
                                    <p><strong>*</strong> Sala Prakeaw</p>
                                    <p className="firstmeet-detail">
                                    <strong>FIRST MEET</strong><br />
                                    16:00 | 15 JAN 2017<br />
                                    Chulachakrabong Bld.<br />
                                    <i><b>"Please bring your stident card to firstmeet"</b></i>
                                    </p>
                                    <p className="regis-detail">
                                    <strong>REGISTERATION DURATION</strong><br />
                                    1 JAN 2017 - 10 JAN 2017<br />
                                    </p>
                                </div>

                            </div>
                        </div>
                    </div>
                    <p className="hr"></p>
                    <div className="event-bio">
                        <h3 className="display-none">Bio</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque id ipsum orci. Aliquam erat volutpat. Sed in erat quis mi laoreet vestibulum. Fusce vitae tempor nisi. Fusce aliquam dolor mi, sit amet egestas ex imperdiet fringilla. Nullam nisl quam, convallis vitae viverra in, lacinia nec lectus. Praesent nibh metus, luctus nec tortor sit amet, hendrerit congue elit. Aliquam erat volutpat. Quisque ex arcu, iaculis blandit arcu at, molestie mattis mauris. Etiam in tortor nec metus eleifend euismod. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
                        </p>
                        <p>
                            Nulla congue tincidunt sem non ullamcorper. Etiam mattis auctor tellus. Aenean ultricies lacus at elementum fermentum. Nunc hendrerit neque et nibh sodales, a malesuada orci euismod. Aliquam a pharetra purus, nec porta augue. Donec in elit non arcu commodo tristique. Integer nunc ligula, tristique eget nisl non, consectetur pharetra lacus.
                        </p>
                        <p>
                            Cras pellentesque enim justo, id pharetra neque pulvinar quis. Suspendisse a odio lacinia, maximus dolor et, maximus massa. Curabitur dolor nibh, pulvinar imperdiet nunc id, placerat venenatis massa. Donec vitae venenatis nisi. Ut iaculis sem a tempor ullamcorper. Ut aliquam venenatis fermentum. Nam porttitor libero sit amet nisl mattis, sed tincidunt eros tincidunt.
                        </p>
                    </div>
                </article>
                <div className="background-overlay"/>
            </div>
        );
    }
}

export default channelInfo;
