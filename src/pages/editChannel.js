import React , { Component } from 'react';
import EventItem from '../container/eventItem';
// import CardList from '../components/cardList';
// import SlickCarousel from '../components/slickCarousel';
import Circle from '../components/circle';
// import ChannelList from '../components/channelList';

import pages from '../hoc/pages';
import normalPage from '../hoc/normPage';

class channelPage extends Component {

    constructor(props) {
        super(props);
        this.onClickMe = this.onClickMe.bind(this);
        this.onItemPopUpClick = this.onItemPopUpClick.bind(this);
    }

    onClickMe() {
        // this.props.searched_item_handler(true);
    }

    onItemPopUpClick(item) {
        if(this.props.pages.pop_up_item === null) this.props.set_pop_up_item(item);
        this.props.toggle_pop_item();
    }

    render() {

        let posterTest = [];
        for(var i = 1; i < 32; i++) {
            posterTest.push(`../../resource/images/poster_dummy/${i}.jpg`);
        }

        return (
            <section className="channel-main">
                <section className="channel-head">
                    <div className="cn-tag">
                        <Circle parent="tag" />
                        <Circle parent="tag" />
                    </div>
                    <div alt="cn-cover-pic"/>
                    <img alt="edit-cn-cover-pic"/>
                    <img src="../resource/images/dummyProfile.png" alt="cn-profile-pic"/>
                    <img alt="edit-cn-profile-pic"/>
                    <div className="edit-cn-detail">
                        <button>EDIT DETAIL</button>
                    </div>
                    <div className="edit-cn-name">
                        <button>EDIT</button>
                        <h1>CHANNEL NAME</h1>
                        <p>"channel caption channel caption channel caption channel caption channel caption channel caption channel caption"</p>
                    </div>
                    <div className="add-event">
                        <img alt="add-event"/>
                        <h1>ADD EVENT</h1>
                    </div>
                </section>
                <section className="cn-event">
                    <section className="cn-top-event">
                        <h1>TOP Event</h1>
                        <p className="hr"></p>
                        <EventItem posterSrc={posterTest[0]} detail-shown="true" onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} />
                        <EventItem posterSrc={posterTest[1]} detail-shown="true" onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} />
                    </section>
                    <section className="cn-all-event">
                        <h1>Event of this channel</h1>
                        <p className="hr"></p>
                        <EventItem posterSrc={posterTest[2]} detail-shown="true" onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} />
                        <EventItem posterSrc={posterTest[3]} detail-shown="true" onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} />
                        <EventItem posterSrc={posterTest[4]} detail-shown="true" onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} />
                    </section>
                    <section className="cn-completed-event">
                        <h1>Completed Event</h1>
                        <p className="hr"></p>
                        <EventItem posterSrc={posterTest[5]} detail-shown="true" onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} />
                        <EventItem posterSrc={posterTest[6]} detail-shown="true" onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} />
                        <EventItem posterSrc={posterTest[7]} detail-shown="true" onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} />
                    </section>
                </section>
            </section>
        );
    }
}


export default normalPage(pages(channelPage, true));
