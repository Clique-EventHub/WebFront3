import React , { Component } from 'react';
import FeedbackForm from '../components/FeedbackForm';
import './css/FeedbackCSS.css';

import pages from '../hoc/pages';
import normalPage from '../hoc/normPage';

const FeedbackPage = (props) => {
    return (
        <section role="main-content" className="hack">
            <FeedbackForm />
        </section>
    );
}

export default normalPage(pages(FeedbackPage, true));
