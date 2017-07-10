import React, { Component } from 'react';
import Circle from './circle';

class channelList extends Component {
    // constructor(props) {
    //     super(props);
    //
    // }

    render() {
        let parent = "channel";
        return (
            <section className="channelList">
                <Circle parent={parent} />
                <Circle parent={parent} />
                <Circle parent={parent} />
                <Circle parent={parent} />
                <Circle parent={parent} />
                <Circle parent={parent} />
            </section>
        );
    }
}

export default channelList;
