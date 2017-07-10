import React , { Component } from 'react';
import { getRandomShade } from '../actions/common';

const circle = (props) => {
    if(props.parent === "channel") {
        return (
            <article className={`${props.parent}-item basic-card`}>
                <div role="img" src="" alt="channel-photo" className={getRandomShade()}/>
                <h3>Channel Name</h3>
            </article>
        );
    }
    return (
        <article className={`${props.parent}-item ${getRandomShade()}`}>
            <h3 className="display-none">Tag Name</h3>
        </article>
    );
}

export default circle;
