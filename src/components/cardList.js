/* eslint-disable */

import React, { Component } from 'react';
import EventItem from '../container/eventItem';

const cardList = (props) => {
    const itemIds = props.eventIds || [];
    return (
        <section aria-hidden="false" role="card-list">
            <h2 className="display-none">Card List</h2>
            {
                itemIds.map((id, index) => {
                    return (
                        <EventItem key={index} detail-shown="false" {...props} />
                    );
                })
            }
        </section>
    );
}

export default cardList;
