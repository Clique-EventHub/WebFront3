import React , { Component } from 'react';
import Calendar from '../components/calendar';

import pages from '../hoc/pages';
import normalPage from '../hoc/normPage';

const calendarPage = (props) => {
    return (
        <section role="main-content">
            <Calendar {...props} />
        </section>
    );
}

export default normalPage(pages(calendarPage, true));
