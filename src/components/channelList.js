import React from 'react';
import Circle from './circle';

const channelList = (props) => {
    const parent = "channel";
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

export default channelList;
