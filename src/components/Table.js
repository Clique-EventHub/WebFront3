import React, { Component } from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Loader from './Loader'
import CustomRadio from './CustomRadio';

import InputText from '../Styled_Components/InputText';
import InputGroup from '../Styled_Components/InputGroup';
import BtnGroup from '../Styled_Components/BtnGroup';

//TODO
/*
*   Add Filter By Search                                [Checked]
*   Add Show only field                                 [Checked]
*   Add Toggle Check-in and Toggle Accept               [Checked]
*   Change not accept icon to cross icon                [Checked]
*   Add shortcut such as select all or deselect all     [Checked]
*   Add who is in selection                             [Checked]
*   Use Lodash                                          [Checked]
*   Automatic Update from nextProps                     [Checked]
*   Add Message Box                                     [Checked]
*   Add PropTypes for safety use                        [Checked]
*   Add CSV Export                                      [Checked]
*   Add Color Support at who is in selection field      [Checked]
*   Add Export CSV on Selection                         [Checked]
*   Add CSV Export                                      [Checked]
*   Add form display support                            [Checked]
*   Add Loading support                                 [Checked]
*   Add isLoad                                          [Checked]
*   Add Error PopUp - Need to change project            [Remove from this scope]
*/

const CloseThin = styled.div`
    position: relative;
    display: inline-block;
    margin-left: 10px;
    padding-bottom: 1px;
    width: 0.75em;
    height: 0.75em;
    opacity: 0.3;

    &:hover {
        opacity: 1;
    }
    &:before, &:after {
        position: absolute;
        left: calc(0.75em/2);
        content: ' ';
        height: calc(1.414 * 0.75em);
        width: 2px;
        background-color: #333;
    }
    &:before {
        transform: rotate(45deg);
    }
    &:after {
        transform: rotate(-45deg);
    }
`

const BoxKit = styled.div`
    background-color: #FFF;
    border: 1px solid #000;
    border-radius: 0.5em;
    display: inline-block;
    padding: 5px 15px 3px 15px;
    margin-right: 5px;
    margin-bottom: 10px;
    position: relative;
    border: 1px solid #DDDDDD;
    color: #777;

    &:hover {
        background-color: #EEE;
    }

    &.accepted {
        background-color: rgb(144, 238, 144) !important;
        &:hover {
            background-color: rgb(129, 223, 129) !important;
        }
    }

    &.check-in {
        background-color: rgb(79, 223, 62) !important;
        color: #FFF;

        &:hover {
            background-color: rgb(64, 208, 47) !important;
        }

        > * {
            opacity: 1;

            &:hover::before, &:hover::after {
                background-color: rgba(255, 255, 255, 0.7) !important;
            }

            &::before,  &::after {
                background-color: #FFF;
                opacity: 1;
            }
        }
    }
`;

const TableStyled = styled.div`
    font-family: "Century Gothic", CenturyGothic, Muli, AppleGothic, sans-serif;
    padding: 0 35px;
    color: #555555;

    > div {
        margin-bottom: 15px;
    }

    ul {
        list-style-type: none;
        padding-left: 0;
    }

    .table-main {
        overflow-x: scroll;
        overflow-y: scroll;
        max-height: 500px;
        max-width: 95vw;
        position: relative;
        border: 1px solid #DDDDDD;
    }

    .table {
        display: table;
        table-layout:fixed;
        text-align: center;
        border-collapse: collapse;
        border-spacing: 0px;
        position: relative;
        border-top: 1px solid #DDDDDD;
        border-bottom: 1px solid #DDDDDD;
        clear: left
        overflow: hidden;
    }

    .table .thead {
        display: table-header-group;
    }

    .table .thead .th {
        padding: 15px 40px;
        text-transform: uppercase;
        white-space: nowrap;
        justify-content: center;

        background-color: #555555;
        color: #FFF;
        font-weight: normal;
        border-bottom: 1.5px solid #AAAAAA;
        position: sticky;
        z-index: 300;
        top: -1px;
        overflow: hidden;
    }

    .table .tr:nth-child(odd) {
        background-color: #f5f5f5;
    }

    .table .tbody {
        display: table-row-group;
        top: 3em;
        overflow: hidden;
    }

    .table .tr {
        display: table-row;
        overflow: hidden;
    }

    .fa {
        font-size: 1.25em;
    }

    .MR10 {
        margin-right: 10px;
    }

    .color-disable {
        color: #999;
        -webkit-text-stroke-width: 1px;
        -webkit-text-stroke-color: #555;
    }

    .color-enable {
        color: #0E8;
        -webkit-text-stroke-width: 1px;
        -webkit-text-stroke-color: #AAA;
    }
    
    .table .tr.selected {
        background: rgba(150, 150, 150, 0.3);
    }

    .table .td,
    .table .th {
        display: table-cell;
        text-align: center;
        border: 1px solid #AAAAAA;
        border-bottom: 0px solid #F0F0F0;
    }

    .table .td.question {
        min-width: 200px;
    }

    .table .td {
        padding: 20px 20px;
        position: relative;
    }

    .table .td:hover {
        background-color: rgba(173,216,230,1) !important;
    }

    .display-none {
        display: none;
    }

    .selection-container {
        margin: 20px 0px 5px 0px;
    }

    .flex-collapse {
        flex: 1;
    }

    @media (max-width: 1024px) {
        .flex-collapse {
            flex-basis: 100%;
        }
    }
`;

const FilterSearchStyled = styled.div`
    input[type="text"] {
        background-color: transparent;
        border: none;
        outline: none;
        border-radius: 5px;
        padding: 5px 5px;
    }
`;

const RadioState = [{
    'type': 'circle',
    'value': true
}, {
    'type': 'none',
    'value': false
},];

class Table extends Component {
    constructor(props) {
        super(props);
        let values = {}
        let filter_field = {
            isEnable: false
        }
        let questions_map = {}
        Object.keys(_.get(props, 'values', {})).forEach((id) => {
            values[id] = props.values[id];
            values[id]['row_selected'] = false;
            values[id]['is_accepted'] = false;
            values[id]['is_check_in'] = false;
            values[id]['is_filtered_out'] = false;
        })
        _.get(props, 'fields', []).forEach((key) => {
            filter_field[key] = true
        })
        _.get(props, 'questions', []).forEach((item, index) => {
            let key = _.get(item, `question`)
            questions_map[key] = "Q." + String(index+1);
            filter_field[key] = true
        })
        this.state = {
            'values': values,
            'filter_field': filter_field,
            'form_values': {},
            'questions_map': questions_map
        }
        this.onRowSelected = this.onRowSelected.bind(this);
        this.onSetNewValues = this.onSetNewValues.bind(this);
        this.onFilterWord = this.onFilterWord.bind(this);
        this.onMessage = this.onMessage.bind(this);
        this.onChangeFilterField = this.onChangeFilterField.bind(this);
        this.onCSVDataCal = this.onCSVDataCal.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onAccept = (() => this.onChangeBoolean("onAccept", true))
        this.onCheckIn = (() => this.onChangeBoolean("onCheckIn", true))
        this.onDeAccept = (() => this.onChangeBoolean("onAccept", false))
        this.onDeCheckIn = (() => this.onChangeBoolean("onCheckIn", false))
        this.onAcceptToggle = (() => this.onChangeBoolean("onAccept", "toggle"))
        this.onCheckInToggle = (() => this.onChangeBoolean("onCheckIn", "toggle"))
    }

    onSetNewValues(new_values) {
        if (this._isMounted) {
            this.setState((prevState, props) => {
                return ({
                    ...prevState,
                    values: new_values
                });
            })
        }
    }

    onFilterWord(word) {
        let new_values = {}
        Object.keys(_.get(this.state, 'values', {})).forEach((key) => {
            let isFound = false;
            for (let i = 0; i < this.props.fields.length; i++) {
                if (typeof this.state.values[key][this.props.fields[i]] === "string" && this.state.values[key][this.props.fields[i]].toLowerCase().indexOf(word.toLowerCase()) !== -1) {
                    isFound = true
                    break
                }
            }
            Object.keys(_.get(this.state, 'questions_map', {})).forEach((q, indd) => {
                if(!isFound) {
                    let ans = _.get(this.props, `response[${key}].answers.responses[${indd}].answer`);
                    if (typeof ans === "string" && ans.toLowerCase().indexOf(word.toLowerCase()) !== -1) {
                        isFound = true;
                    }
                }
            })
            new_values[key] = {
                ..._.get(this.state, `values[${key}]`, {}),
                is_filtered_out: !isFound
            }
        });

        this.onSetNewValues(new_values);
    }

    onChangeBoolean(stateName, value) {
        let new_values = { ..._.get(this.state, 'values', {}) };
        let accepted_ids = []
        let rejected_ids = []
        let check_in_good = []
        let check_in_bad = []
        if (stateName === "onAccept") {
            if (typeof value === "boolean") {
                Object.keys(_.get(this.state, 'values', {})).forEach((key) => {
                    if (_.get(this.state, `values[${key}].row_selected`, {})) {
                        new_values[key].is_accepted = value
                        if (value) {
                            accepted_ids.push(key)
                        }
                        else {
                            new_values[key].is_check_in = false
                            rejected_ids.push(key)
                            check_in_bad.push(key)
                        }
                    }
                })
            } else {
                Object.keys(_.get(this.state, 'values', {})).forEach((key) => {
                    if (_.get(this.state, `values[${key}].row_selected`, {})) {
                        if (new_values[key].is_accepted) {
                            new_values[key].is_check_in = false
                            check_in_bad.push(key)
                        }
                        if (new_values[key].is_accepted) {
                            rejected_ids.push(key)
                        } else {
                            accepted_ids.push(key)
                        }
                        new_values[key].is_accepted = !new_values[key].is_accepted
                    }
                })
            }
        } if (stateName === "onCheckIn") {
            if (typeof value === "boolean") {
                Object.keys(_.get(this.state, 'values', {})).forEach((key) => {
                    if (_.get(this.state, `values[${key}].row_selected`, {})) {
                        if (value) {
                            if (new_values[key].is_accepted) {
                                if (value) check_in_good.push(key)
                                else check_in_bad.push(key)
                                new_values[key].is_check_in = value
                            }
                        } else {
                            if (value) check_in_good.push(key)
                            else check_in_bad.push(key)
                            new_values[key].is_check_in = value
                        }
                    }
                })
            } else {
                Object.keys(_.get(this.state, 'values', {})).forEach((key) => {
                    if (_.get(this.state, `values[${key}].row_selected`, {})) {
                        if (!new_values[key].is_check_in) {
                            if (new_values[key].is_accepted) {
                                if (!new_values[key].is_check_in) check_in_good.push(key)
                                else check_in_bad.push(key)
                                new_values[key].is_check_in = !new_values[key].is_check_in;
                            }
                        } else {
                            if (!new_values[key].is_check_in) check_in_good.push(key)
                            else check_in_bad.push(key)
                            new_values[key].is_check_in = !new_values[key].is_check_in;
                        }
                    }
                })
            }
        }
        try {
            this.props.onSentAccepted(accepted_ids, rejected_ids);
            this.props.onSentCheckIn(check_in_good, check_in_bad);
        } catch (e) {
            this.props.onErrorMsg("Oh! Ow! Something went wrong", "Cannot Update Table at this time");
        }
        this.onSetNewValues(new_values);
    }

    onMessage() {
        try {
            let Sample = Object.keys(_.get(this.state, 'values', {})).filter((key) => _.get(this.state, `values[${key}].row_selected`, false))
            this.props.onMessageSent(Sample, this._message_input.value);
        } catch (e) {
            this.props.onErrorMsg("Oh! Ow! Something went wrong", "Cannot Sent Message at this time");
        }
    }

    onChangeFilterField(fieldName, value) {
        if (this._isMounted) {
            this.setState((prevState, props) => {
                let new_filter_field = { ...prevState.filter_field }
                new_filter_field[fieldName] = value
                return ({
                    ...prevState,
                    filter_field: new_filter_field
                });
            })
        }
    }

    onRowSelected(id) {
        if (this._isMounted) {
            this.setState((prevState, props) => {
                let new_values = { ...prevState.values }
                new_values[id].row_selected = !new_values[id].row_selected;
                return ({
                    ...prevState,
                    'values': new_values,
                });
            })
        }
    }

    onCSVDataCal(is_use_selection) {
        try {
            let fields = ["Index", "Accepted", "Check-in"].concat(_.get(this.props, 'fields', []).filter((key) => {
                return _.get(this.state, `filter_field[${key}]`, false);
            }))
            let CSVData = [];
            CSVData.push(fields.concat(Object.keys(_.get(this.state, 'questions_map', {}))));
            Object.keys(_.get(this.state, 'values', [])).forEach((key, index) => {
                if ((is_use_selection)) {
                    if (!_.get(this.state, `values[${key}]['row_selected']`, false)) {
                        return;
                    }
                }
                let dat = [];
                fields.forEach((topic, ind) => {
                    if (topic === "Index") dat.push(index + 1)
                    else if (topic === "Accepted") dat.push(_.get(this.state, `values[${key}]['is_accepted']`, false))
                    else if (topic === "Check-in") dat.push(_.get(this.state, `values[${key}]['is_check_in']`, false))
                    else {
                        dat.push(_.get(this.state, `values[${key}][${topic}]`, ""));
                    }
                })
                Object.keys(_.get(this.state, 'questions_map', {})).forEach((q, indd) => {
                    dat.push(_.get(this.props, `response[${key}].answers.responses[${indd}].answer`, ''))
                })
                CSVData.push(dat);
            });
            this.props.onCSVDataChange(CSVData);
        } catch (e) {
            this.props.onErrorMsg("Oh! Ow! Something went wrong", "Cannot Export CSV Data at this time");
        }
    }

    componentWillReceiveProps(nextProps) {
        /*
        *   Add automatic modification for values of the state when new props is sent in
        */

        let oldKeys = Object.keys(_.get(this.state, 'values', {}));
        let newKeys = Object.keys(_.get(nextProps, 'values', {}));

        let new_values = {};
        newKeys.forEach((key) => {
            if (oldKeys.indexOf(key) !== -1) {
                new_values[key] = {
                    ..._.get(this.state, `values[${key}]`, {}),
                    row_selected: false,
                    is_accepted: false,
                    is_check_in: false,
                    is_filtered_out: false
                }
            } else {
                new_values[key] = {
                    ..._.get(nextProps, `values[${key}]`, {}),
                    row_selected: false,
                    is_accepted: false,
                    is_check_in: false,
                    is_filtered_out: false
                }
            }
        })

        if (this._isMounted) {
            this.setState((prevState, props) => {
                return ({
                    ...prevState,
                    'values': new_values
                });
            })
        }
    }

    onKeyDown(e) {
        if (e.keyCode === 27 || e.keyCode === 17) {
            if (this._isMounted) {
                this.setState((prevState, props) => {
                    let val = e.keyCode === 17
                    let new_values = {}
                    Object.keys(prevState.values).forEach((key) => {
                        new_values[key] = {
                            ...prevState.values[key],
                            row_selected: val
                        }
                    });
                    return ({
                        ...prevState,
                        values: new_values
                    });
                })
            }
        }
    }

    componentDidUpdate() {
        console.log(this.state)
    }

    componentDidMount() {
        this._isMounted = true;
        this._table.addEventListener('keydown', this.onKeyDown);
    }

    componentWillUnmount() {
        this._isMounted = false;
        this._table.removeEventListener('keydown', this.onKeyDown)
    }

    render() {
        const FilterSearch = (
            <FilterSearchStyled>
                <form onSubmit={(e) => { e.preventDefault(); return false; }}>
                    <i className="fa fa-search MR10" aria-hidden="true" />
                    <InputText placeholder="Search" className="large" type="text" onChange={(e) => { this.onFilterWord(e.target.value) }} />
                </form>
            </FilterSearchStyled>
        );
        const QuestionInfo = (
            <ul>
                {
                    (Object.keys(_.get(this.state, 'questions_map', {})).map((question, key) => {
                        return <li key={key}><b style={{'marginRight': '20px'}}>{_.get(this.state, `questions_map[${question}]`)}</b>{question}</li>
                    }))
                }
            </ul>
        );
        const MainTable = (
            <div className="table-main" ref={((table) => this._table = table)}>
                <div className="table">
                    <div className="thead">
                        <div className="th">
                            Index
                            </div>
                        <div className="th">
                            Accepted
                            </div>
                        <div className="th">
                            Check-in
                            </div>
                        {
                            (_.get(this.props, 'fields', []).map(((topic, index) => {
                                if (_.get(this.state, 'filter_field.isEnable', false)) {
                                    if (_.get(this.state, `filter_field[${topic}]`, false)) {
                                        return (<div className="th" key={index} tabIndex="1">
                                            {topic}
                                        </div>);
                                    }
                                    return null;
                                } else {
                                    return (<div className="th" key={index} tabIndex="1">
                                        {topic}
                                    </div>);
                                }
                            })))
                        }
                        {
                            (Object.keys(_.get(this.state, 'questions_map', {})).map((question, key) => {
                                if (_.get(this.state, 'filter_field.isEnable', false)) {
                                    if (_.get(this.state, `filter_field[${question}]`, false)) {
                                        return (<div className="th" title={question} tabIndex="1" key={`q-${key}`}>{_.get(this.state, `questions_map[${question}]`)}</div>);
                                    }
                                    return null;
                                } else {
                                    return (<div className="th" title={question} tabIndex="1" key={`q-${key}`}>{_.get(this.state, `questions_map[${question}]`)}</div>);
                                }
                            }))
                        }
                    </div>
                    <div className="tbody">
                        {(Object.keys(_.get(this.state, `values`, {})).filter((key) => !_.get(this.state, `values[${key}].is_filtered_out`, true)).map((key, index) => {
                            return (
                                <div className={`tr${(_.get(this.state, `values[${key}].row_selected`, false) ? ' selected' : '')}`} key={index} onClick={() => this.onRowSelected(key)}>
                                    <div className="td" tabIndex="1">
                                        {index + 1}
                                    </div>
                                    <div className="td" tabIndex="1">
                                        <i className={`fa ${_.get(this.state, `values[${key}].is_accepted`, false) ? 'fa-check color-enable' : 'fa-times color-disable'}`} />
                                    </div>
                                    <div className="td" tabIndex="1">
                                        <i className={`fa ${_.get(this.state, `values[${key}].is_check_in`, false) ? 'fa-check color-enable' : 'fa-times color-disable'}`} />
                                    </div>
                                    {
                                        _.get(this.props, `fields`, []).map((topic, ind) => {
                                            if (_.get(this.state, `filter_field.isEnable`, false)) {
                                                if (_.get(this.state, `filter_field[${topic}]`, false)) {
                                                    return (
                                                        <div className="td" key={ind} tabIndex="1">
                                                            {_.get(this.state, `values[${key}][${topic}]`, '')}
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            } else {
                                                return (
                                                    <div className="td" key={ind} tabIndex="1">
                                                        {_.get(this.state, `values[${key}][${topic}]`, '')}
                                                    </div>
                                                );
                                            }
                                        })
                                    }
                                    {
                                        (Object.keys(_.get(this.state, 'questions_map', {})).map((question, indd) => {
                                            if (_.get(this.state, `filter_field.isEnable`, false)) {
                                                if (_.get(this.state, `filter_field[${question}]`, false)) {
                                                    return (
                                                        <div key={`q-${indd}`} className="td question" tabIndex="1">
                                                            {_.get(this.props, `response[${key}].answers.responses[${indd}].answer`, '')}
                                                        </div>);
                                                }
                                                return null;
                                            } else {
                                                return (
                                                    <div key={`q-${indd}`} className="td question" tabIndex="1">
                                                        {_.get(this.props, `response[${key}].answers.responses[${indd}].answer`, '')}
                                                    </div>
                                                );
                                            }
                                        }))
                                    }
                                </div>
                            );
                        }))}
                    </div>
                </div>
            </div>
        );
        const InSelection = (
            <div className="selection-container">
                {
                    Object.keys(_.get(this.state, `values`, {})).filter(
                        (key) => _.get(this.state, `values[${key}].row_selected`, false)
                    ).map(
                        (key, index) => {
                            return (
                                <BoxKit key={index} className={(_.get(this.state, `values[${key}]['is_check_in']`, false)) ? 'check-in' : (_.get(this.state, `values[${key}]['is_accepted']`, false)) ? 'accepted' : ''}>
                                    {_.get(this.state, `values[${key}][${this.props.fields[0]}]`, '')}
                                    <CloseThin onClick={() => this.onRowSelected(key)} />
                                </BoxKit>);
                        }
                        )
                }
            </div>
        );
        const ActionButton = (
            <BtnGroup style={{'margin': '10px 0px'}}>
                <button className="Btn-green" onClick={this.onAccept}>
                    Accept
                </button>
                <button className="Btn-red" onClick={this.onDeAccept}>
                    Not Accept
                </button>
                <button className="Btn-green" onClick={this.onCheckIn}>
                    Check In
                </button>
                <button className="Btn-red" onClick={this.onDeCheckIn}>
                    Not Check In
                </button>
            </BtnGroup>
        );
        const FilterField = (
            <div style={{ 'margin': '10px 0px' }}>
                <h2>Filter Fields</h2>
                <CustomRadio
                    isLoad={true}
                    onClick={(e) => {
                        this.onChangeFilterField('isEnable', e.value)
                    }}
                    state={RadioState}
                    initialValue={false}
                    text="Enable"
                />
                <div className={(_.get(this.state, 'filter_field.isEnable', false)) ? '' : 'display-none'}>
                    {
                        this.props.fields.map((key, index) => {
                            return (
                                <CustomRadio
                                    key={index}
                                    text={key}
                                    isLoad={true}
                                    onClick={(e) => {
                                        this.onChangeFilterField(key, e.value)
                                    }}
                                    state={RadioState}
                                    initialValue={true}
                                    isInline={false}
                                    style={{ 'margin': '5px 0px' }}
                                />
                            );
                        })
                    }
                    <div style={{
                        'margin': '20px 0px'
                    }}/>
                    {
                        Object.keys(_.get(this.state, 'questions_map', {})).map((key, index) => {
                            return (
                                <CustomRadio
                                    key={index}
                                    text={`${_.get(this.state, `questions_map[${key}]`, '')} : ${key}`}
                                    isLoad={true}
                                    onClick={(e) => {
                                        this.onChangeFilterField(key, e.value)
                                    }}
                                    state={RadioState}
                                    initialValue={true}
                                    isInline={false}
                                    style={{'margin': '5px 0px'}}
                                />
                            );
                        })
                    }
                </div>
            </div>
        );
        const MessageBox = (
            <InputGroup>
                <form onSubmit={(e) => { e.preventDefault(); this.onMessage(); return false; }}>
                    <input placeholder="Message" type="text" ref={(input) => this._message_input = input} />
                    <button type="submit">Sent</button>
                </form>
            </InputGroup>
        );
        const CSVData = (
            <BtnGroup>
                <button onClick={() => this.onCSVDataCal(false)}>Export CSV</button>
                <button onClick={() => this.onCSVDataCal(true)}>Export CSV Selection</button>
            </BtnGroup>
        );

        return (
            <TableStyled>
                {FilterSearch}
                {MainTable}
                <div style={{'display': 'flex', 'flexWrap': 'wrap'}}>
                    <div className="flex-collapse">
                        {InSelection}
                        {ActionButton}
                        {MessageBox}
                    </div>
                    <div className="flex-collapse">
                        {QuestionInfo}
                    </div>
                </div>
                <div style={{ 'display': 'flex', 'flexWrap': 'wrap' }}>
                    <div className="flex-collapse">
                        {CSVData}
                    </div>
                    <div className="flex-collapse">
                        {FilterField}
                    </div>
                </div>
                
            </TableStyled>
        );
    }
}

const fields = ['Student Id', 'Firstname', 'Lastname', 'Gender', 'Faculty', 'Allergic']

const TableLoad = (props) => {
    if(typeof props.isLoad === "boolean" && props.isLoad) {
        return <Table {...props} />
    }
    return (<div>{props.loadingComponent}</div>)
}

Table.propTypes = {
    fields: PropTypes.arrayOf(PropTypes.string).isRequired,
    values: PropTypes.objectOf(PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.bool]))).isRequired,
    onMessageSent: PropTypes.func.isRequired,
    onCSVDataChange: PropTypes.func.isRequired,
    onErrorMsg: PropTypes.func.isRequired,
    onSentAccepted: PropTypes.func.isRequired,
    onSentCheckIn: PropTypes.func.isRequired
}

TableLoad.PropTypes = {
    isLoad: PropTypes.bool.isRequired,
    loadingComponent: PropTypes.element.isRequired,
    fields: PropTypes.arrayOf(PropTypes.string).isRequired,
    values: PropTypes.objectOf(PropTypes.objectOf(PropTypes.string)).isRequired,
    onMessageSent: PropTypes.func.isRequired,
    onCSVDataChange: PropTypes.func.isRequired,
    onErrorMsg: PropTypes.func.isRequired,
    onSentAccepted: PropTypes.func.isRequired,
    onSentCheckIn: PropTypes.func.isRequired
}

TableLoad.defaultProps = {
    'loadingComponent': (<Loader />),
    'onMessageSent': (ids, message) => {
        console.log(ids, message)
    },
    'onCSVDataChange': (CSVData) => {
        console.log(CSVData);
    },
    'onErrorMsg': (errorMsg, errorDetail) => {
        console.log(errorMsg, errorDetail)
    },
    'onSentAccepted': (accepted_ids, rejected_ids) => {
        console.log(accepted_ids, rejected_ids)
    },
    'onSentCheckIn': (accepted_ids, rejected_ids) => {
        console.log(accepted_ids, rejected_ids)
    },
    'fields': fields,
    questions: [
        {
            _id: "59ddba1f7def72001036461d",
            question: "\"คำถามที่ใครต่างคนหาความหมาย ที่แท้ของคำว่าความรัก\" เป็นเพลงของใคร",
            choices: null,
            type: "short answer"
        },
        {
            _id: "59ddba1f7def72001036461c",
            question: "ชอบกินอาหารอะไร (ตอบไ้มากกว่า 1 ประเภท)",
            choices: [
                "อาหารเส้น",
                "อาหารเนื้อ",
                "อาหารผัก",
                "อาหารทอด",
                "อาหารหรูๆ",
                "อาหารอะไรก็ได้",
                "อาหารที่ไม่ต้องจ่ายตังค์เอง",
                "อาหารในจานเพื่อน",
                "อาหารตา",
                "อาหารสด",
                "อาหารปิ๊ง ย่าง",
                "ไม่แดกงับ เก็บตังค์",
                "การบ้าน การเรียน การงาน"
            ],
            type: "check box"
        },
        {
            _id: "59ddba1f7def72001036461b",
            question: "ชอบเล่นเกมประเภทอะไรมากที่สุด (1 ประเภท)",
            choices: [
                "Puzzle",
                "Platformer",
                "Adventure",
                "Increment",
                "FPS",
                "Action",
                "RPG",
                "Anime"
            ],
            type: "bullet"
        },
        {
            _id: "59ddba1f7def72001036461a",
            question: "อายุเท่าไหร่",
            choices: [
                "17",
                "18",
                "19",
                "20",
                "21",
                "22",
                "23",
                "24",
                "25",
                "26",
                "27",
                "28",
                "29",
                "30",
                "31",
                "32",
                "33",
                "34",
                "35",
                "36",
                "37",
                "38",
                "39",
                "40"
            ],
            type: "spinner"
        }
    ],
    'response': {
        'Bar1RAQpbeAkdNw': {
            'answers': {
                'responses': [
                    {
                        question: "\"คำถามที่ใครต่างคนหาความหมาย ที่แท้ของคำว่าความรัก\" เป็นเพลงของใคร",
                        answer: "ท๊อฟฟี่ นิชาภา โพธิ์งาม"
                    },
                    {
                        question: "ชอบกินอาหารอะไร (ตอบไ้มากกว่า 1 ประเภท)",
                        answer: "อาหารเส้น, อาหารหรูๆ, อาหารที่ไม่ต้องจ่ายตังค์เอง, อาหารในจานเพื่อน, อาหารตา, อาหารสด, อาหารปิ๊ง ย่าง, การบ้าน การเรียน การงาน"
                    },
                    {
                        question: "ชอบเล่นเกมประเภทอะไรมากที่สุด (1 ประเภท)",
                        answer: "Puzzle"
                    },
                    {
                        question: "อายุเท่าไหร่",
                        answer: "20"
                    }
                ]
            }
        }
    },
    'values': {
        'Bar1RAQpbeAkdNw': {
            'Firstname': 'Thipok',
            'Lastname': 'Thammakulangkul',
            'Gender': 'Male',
            'Faculty': 'Engineering',
            'Allergic': 'Sand',
            'Student Id': '5831030021'
        },
        '92zypO7jcNw4Ynz': {
            'Firstname': 'Thipok',
            'Lastname': 'Thammakulangkul',
            'Gender': 'Male',
            'Faculty': 'Engineering',
            'Allergic': 'Sand',
            'Student Id': '5831040021'
        },
        'xJcdRZeEfe7ykpf': {
            'Firstname': 'Thipok',
            'Lastname': 'Thammakulangkul',
            'Gender': 'Male',
            'Faculty': 'Engineering',
            'Allergic': 'Sand',
            'Student Id': '5831050021'
        },
        'EQL4Mke59s29ZqP': {
            'Firstname': 'Thipok',
            'Lastname': 'Thammakulangkul',
            'Gender': 'Male',
            'Faculty': 'Engineering',
            'Allergic': 'Sand',
            'Student Id': '5831060021'
        },
        'GWwWq8jhnn0dmYU': {
            'Firstname': 'Thipok',
            'Lastname': 'Thammakulangkul',
            'Gender': 'Male',
            'Faculty': 'Engineering',
            'Allergic': 'Sand',
            'Student Id': '5831070021'
        },
        'lq8RQYuHY3xWiOT': {
            'Firstname': 'Thipok',
            'Lastname': 'Thammakulangkul',
            'Gender': 'Male',
            'Faculty': 'Engineering',
            'Allergic': 'Sand',
            'Student Id': '5831080021'
        },
        'OwP0KD7kh2dCQIj': {
            'Firstname': 'Thipok',
            'Lastname': 'Thammakulangkul',
            'Gender': 'Male',
            'Faculty': 'Engineering',
            'Allergic': 'Sand',
            'Student Id': '5831031021'
        },
        '6eUmCc12vPkJblR': {
            'Firstname': 'Thipok',
            'Lastname': 'Thammakulangkul',
            'Gender': 'Male',
            'Faculty': 'Engineering',
            'Allergic': 'Sand',
            'Student Id': '5831041021'
        },
        'cyQLpyGMy5ztlHz': {
            'Firstname': 'Thipok',
            'Lastname': 'Thammakulangkul',
            'Gender': 'Male',
            'Faculty': 'Engineering',
            'Allergic': 'Sand',
            'Student Id': '5831051021'
        },
        'fND1gyLGly2pQgS': {
            'Firstname': 'Tuntawat',
            'Lastname': 'Savahnachatjul',
            'Gender': 'Male',
            'Faculty': 'Engineering',
            'Allergic': 'Food Shortage',
            'Student Id': '5831061021'
        },
        'ereE1v5j5KWxgyo': {
            'Firstname': 'Sookmongkol',
            'Lastname': 'Chivitjitborisutepngsai',
            'Gender': 'Male',
            'Faculty': 'Engineering',
            'Allergic': 'Algorithm Design',
            'Student Id': '5831032321'
        },
        'kiQPbGJYaCSWFEG': {
            'Firstname': 'Thipok',
            'Lastname': 'Thammakulangkul',
            'Gender': 'Male',
            'Faculty': 'Engineering',
            'Allergic': 'Sand',
            'Student Id': '5831081021'
        }
    }
}

export default TableLoad;
