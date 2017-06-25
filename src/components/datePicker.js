import React, { Component } from 'react';

import DayPicker, { DateUtils } from 'react-day-picker';
import LocaleUtils from "react-day-picker/moment";
import "moment/locale/th";

import './style/datePicker.css';

class DatePicker extends Component {

    constructor(props) {
        super(props);
        let disabled = {
            'daysOfWeek': [],
            'after': null,
            'before': null
        }

        if((this.props.disabledDays)) {
            if(this.props.disabledDays.daysOfWeek) disabled.daysOfWeek = this.props.disabledDays.daysOfWeek;
            if(this.props.disabledDays.after) disabled.after = this.props.disabledDays.after;
            if(this.props.disabledDays.before) disabled.before = this.props.disabledDays.before;
        }

        this.state = {
            'mode': (!this.props.initialMode) ? 0 : this.props.initialMode,
            'selectedDays': [],
            'range': {
                'date0': null,
                'date1': null,
                'state': 0
            },
            'disabledDays': disabled,
            'controlEnable': (this.props.controlEnable) ? true : false,
            'showSelectedDate': (this.props.showSelectedDate) ? true : false
        }

        this.onDayClick = this.onDayClick.bind(this);
        this.findDateIndex = this.findDateIndex.bind(this);
        this.generateDayRange = this.generateDayRange.bind(this);
        this.onChangeMode = this.onChangeMode.bind(this);
        this.onClearDates = this.onClearDates.bind(this);
    }

    compareDate(day1, day2) {
        return (day1.getFullYear() === day2.getFullYear() && day1.getMonth() === day2.getMonth() && day1.getDate() === day2.getDate());
    }

    findDateIndex(day) {
        let index = -1;
        for(let i = 0; i < this.state.selectedDays.length && (index === -1); i++) {
            if(this.compareDate(this.state.selectedDays[i], day)) index = i;
        }
        return index;
    }

    onClearDates() {
        this.setState({
            ...(this.state),
            'selectedDays': [],
            'range': {
                'date0': null,
                'date1': null,
                'state': 0
            }
        });
    }

    onChangeMode(new_mode) {
        if(new_mode === 0 || new_mode === 1 || new_mode === 2) {
            this.setState({
                ...(this.state),
                'mode': new_mode,
                'selectedDays': [],
                'range': {
                    'date0': null,
                    'date1': null,
                    'state': 0
                }
            });
        }
    }

    generateDayRange(from, to) {
        if(!from || !to || from === null || to === null) return [];
        let tmp = new Date(from);
        let new_array = [];
        const { daysOfWeek, after, before } = this.state.disabledDays;
        while(tmp.getTime() <= to.getTime()) {
            if(after !== null || before !== null) {
                new_array.push(new Date(tmp));
            } else if(daysOfWeek.indexOf(tmp.getDay()) === -1) {
                new_array.push(new Date(tmp));
            }
            tmp.setDate(tmp.getDate() + 1);
        }

        return new_array;
    }

    onDayClick(day, modifiers, e) {
        if(modifiers.disabled) return;
        day.setHours(0, 0, 0, 0);
        let result = [];
        switch(this.state.mode) {
            case 0:
                if(this.state.selectedDays[0] && this.compareDate(this.state.selectedDays[0], day)) {
                    result = [];
                    this.setState({
                        ...(this.state),
                        'selectedDays': []
                    });
                }
                else {
                    result = [day];
                    this.setState({
                        ...(this.state),
                        'selectedDays': result
                    });
                }
                break;
            case 1:
                const index = this.findDateIndex(day);

                if(index === -1) {
                    result = this.state.selectedDays.concat(day);
                    this.setState({
                        ...(this.state),
                        'selectedDays': result
                    });
                } else {
                    result = this.state.selectedDays.slice(0, index).concat(this.state.selectedDays.slice(index+1, this.state.selectedDays.length));
                    this.setState({
                        ...(this.state),
                        'selectedDays': result
                    })
                }
                break;
            case 2:
                let target = (this.state.range.state === 0) ? 'date0' : 'date1';
                let new_range = Object.assign({}, this.state.range);
                new_range[target] = day;
                new_range.state = (new_range.state + 1)%2;

                if(new_range.date0 === null || new_range.date1 === null) {
                    result = [new_range[target]];
                    this.setState({
                        ...(this.state),
                        'range': new_range,
                        'selectedDays': result
                    });
                } else {
                    let from = (new_range.date0.getTime() < new_range.date1.getTime()) ? new_range.date0 : new_range.date1;
                    let to = (new_range.date0.getTime() >= new_range.date1.getTime()) ? new_range.date0 : new_range.date1;

                    result = this.generateDayRange(from, to);
                    this.setState({
                        ...(this.state),
                        'range': new_range,
                        'selectedDays': result
                    });

                    break;
                }
            default:
        }

        if(typeof(this.props.onSetDates) === "function") {
            this.props.onSetDates(result);
        }
    }

    render() {
        const { selectedDays, mode, range } = this.state;

        let reply = (this.state.mode === 1) ? null : (
            <p className="Reply">
                Please select date
            </p>
        );
        // {(this.state.showSelectedDate) ? reply : null}
        if(selectedDays.length !== 0) {
            switch (mode) {
                case 0:
                    reply = (
                    <p className="Reply">
                        {selectedDays[0].toLocaleDateString()}
                    </p>);
                    break;;
                case 1:
                    reply = null;
                    break;
                case 2:
                    if(range.date0 === null || range.date1 === null || selectedDays.length === 1) {
                        reply = (
                        <p className="Reply">
                            {selectedDays[0].toLocaleDateString()}
                        </p>);
                    } else {
                        let from = (range.date0.getTime() < range.date1.getTime()) ? range.date0 : range.date1;
                        let to = (range.date0.getTime() >= range.date1.getTime()) ? range.date0 : range.date1;

                        reply = (
                        <p className="Reply">
                            {'' + from.toLocaleDateString() + ' - ' + to.toLocaleDateString()}
                        </p>);
                    }
                    break;
                default:
                    reply = 'NA';
            }
        };

        if(!this.state.showSelectedDate) reply = null;

        let controls = (!this.state.controlEnable) ? null : (
            <div className="Date-Controller">
                <div className="Option-Container">
                    <p onClick={() => {this.onChangeMode(0)}}>
                        <input className="RadioButton" type="radio" name="mode-option" value="single-date" checked={this.state.mode === 0} onChange={() => {this.onChangeMode(0)}} />
                        <label onClick={() => {this.onChangeMode(0)}}>Single Date</label>
                    </p>
                    <p onClick={() => {this.onChangeMode(2)}}>
                        <input className="RadioButton" type="radio" name="mode-option" value="range-date" checked={this.state.mode === 2} onChange={() => {this.onChangeMode(2)}} />
                        <label onClick={() => {this.onChangeMode(2)}}>Range of Dates</label>
                    </p>
                    <p onClick={() => {this.onChangeMode(1)}}>
                        <input className="RadioButton" type="radio" name="mode-option" value="multiple-date" checked={this.state.mode === 1} onChange={() => {this.onChangeMode(1)}} />
                        <label onClick={() => {this.onChangeMode(1)}}>Multiple Dates</label>
                    </p>
                </div>
                <button className="outline Clear border-focus-blue" onClick={this.onClearDates}>
                    <i className="fa fa-times" aria-hidden="true"></i>&nbsp;Clear
                </button>
            </div>
        );

        return (
            <div className="DatePicker">
                <div className="DayPicker-Container">
                    <DayPicker
                        onDayClick={ this.onDayClick }
                        selectedDays={ this.state.selectedDays }
                        disabledDays={ this.state.disabledDays }
                        enableOutsideDays={true}
                        localeUtils={ LocaleUtils } locale="en"
                        />
                    {reply}
                </div>
                {controls}
            </div>
        );
    }
}

DatePicker.defaultProps = {
    'initialMode': 0,
    'disabledDays': {
        'daysOfWeek': [],
    },
    'showSelectedDate': true,
    'controlEnable': true,
    'onSetDates': function(result) {
        console.log(result);
    }
}

export default DatePicker;
