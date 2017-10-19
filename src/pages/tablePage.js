import React , { Component } from 'react';
import pages from '../hoc/pages';
import normalPage from '../hoc/normPage';
import './css/tablePage.css';
import axios from 'axios';
import { hostname } from '../actions/index';
import { getRandomShade, getCookie, getEvent, ServerToClientFields } from '../actions/common';
import ErrorPopUp from '../components/ErrorPopUp';
import ReactLoading from 'react-loading';
import { CSVLink } from 'react-csv';
import _ from 'lodash';
import Table from '../components/Table';

class tablePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            'fields': []
        }
        this.onGetGetStat = this.onGetGetStat.bind(this);
        this.onGetGetStat();
    }

    onGetGetStat() {
        const config = {
            'headers': {
                'Authorization': ('JWT ' + getCookie('fb_sever_token')),
                'crossDomain': true
            }
        }

        const eid = _.get(this.props, 'location.query.eid');
        if(eid) {
            axios.get(`${hostname}event/stat?id=${eid}`, config).then(
                (data) => data.data
            ).then((data) => {
                console.log(data);
                if(this._isMounted) {
                    this.setState((prevState) => {
                        return ({
                            ...prevState,
                            fields: data.require_field.concat(data.optional_field)
                        });
                    })
                }
            });
        }
    }

    componentDidMount() {
        this._isMounted = true
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        return (
            <section role="main-content" style={{'backgroundColor': '#FFF', 'borderTop': '1px solid #F1F1F1'}}>
                <Table
                    isLoad={true}
                    fields={this.state.fields.map((item) => ServerToClientFields[item])}
                />
            </section>
        );
    }
}

export default normalPage(pages(tablePage, true));
