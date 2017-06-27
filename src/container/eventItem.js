/* eslint-disable */

import React, { Component } from 'react';
import EventDetail from './eventDetail';
import EventDetailFix from './eventDetail2';

class eventItem extends Component {
    constructor(props) {
        super(props);
        this.onButtonClick = this.onButtonClick.bind(this);
    }

    onButtonClick() {
        this.props.onSetItem(<EventDetailFix onToggle={this.props.onToggle} />);
        this.props.onToggle();
    }

    render() {
        let detailShownClass = (this.props["detail-shown"] === "false") ? "card-only" : "";
        detailShownClass += (this.props.noGlow === "true") ? " basic-card-no-glow" : "";

        const posterObj = (this.props.posterSrc) ? <div role="main-poster" alt="main-poster" style={{backgroundImage: `url('${this.props.posterSrc}')`}} /> : <div role="main-poster" alt="main-poster" style={{backgroundImage: `url('https://about.canva.com/wp-content/uploads/sites/3/2015/01/concert_poster.png')`}}/>;

        return (
            <article role="event-item" className={detailShownClass} onClick={this.onButtonClick}>
                <h3 className="display-none">Event Name</h3>
                {posterObj}
                <div role="overlay" aria-hidden="true"></div>
                <span className="small top" role="joined"><i className="fa fa-check" aria-hidden="true"></i> Joined</span>
                <section content="detail">
                    <h4 className="display-none">Info</h4>
                    <header role="top-detail">
                        <span className="small" role="joined"><i className="fa fa-check" aria-hidden="true"></i> Joined</span>
                        <span className="big">Event Name</span>
                        <span className="medium">by Creator Name</span>
                    </header>
                    <p className="hr" aria-hidden="true" />
                    <section role="middle-detail">
                        <h5 className="display-none">Date and Location</h5>
                        <span className="medium icon-line">
                            <i className="fa fa-calendar" aria-hidden="true"></i>
                             29 JAN 2017
                            </span>
                        <span className="medium icon-line">
                            <i className="fa fa-map-marker" aria-hidden="true"></i>
                             Chulachakrabong Bld.
                         </span>
                    </section>
                    <section role="bio" className="medium">
                        <h5 className="display-none">Bio</h5>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec interdum eros purus, eu suscipit lorem eleifend eget. Pellentesque a finibus felis. Pellentesque quis neque ut dui finibus iaculis. Fusce ac placerat&hellip;
                    </section>
                    <footer role="bottom" className="small">
                        <img role="mini-profile" name="1" />
                        <img role="mini-profile" name="2" />
                        <img role="mini-profile" name="3" />
                        <span role="description">and 360 join this</span>
                    </footer>
                </section>
            </article>
        );
    }
}

export default eventItem;
