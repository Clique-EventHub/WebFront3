import React, { Component } from 'react';
import DatePicker from '../../components/datePicker';
import TimeInput from '../../components/TimeInput';
import './DateAndTime.css';

class DateAndTime extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isInit: false,
            selectedDates: [],
            time_start: '',
            time_end: '',
            page: 1,
            maxPage: 2,
            innerLoad: false,
            returnObj: null
        }

        if(this.props.isLoad) {
            setTimeout(() => {
                this.setState({
                    ...this.state,
                    innerLoad: true
                })
            }, 0);
        }
    }

    nextPage() {
        const { page, maxPage } = this.state;
        const usePage = ((page + 1) > maxPage) ? (page + 1 - maxPage) : (page + 1);
        this.setState({
            ...this.state,
            page: usePage
        })
    }

    previousPage() {
        const { page, maxPage } = this.state;
        const usePage = (page - 1 <= 0) ? (page + maxPage - 1) : (page - 1);
        this.setState({
            ...this.state,
            page: usePage
        })
    }

    toPage(index) {
        this.setState({
            ...this.state,
            page: index
        })
    }

    getPageStyle(index) {
        const { page, maxPage } = this.state;
        if(index <= 0 || index > maxPage) return defaultStyle;
        if(index === page) return defaultStyle;
        return {
            ...defaultStyle,
            display: 'none'
        };
    }

    onUpdate(val, ref) {
        let isValid = true;
        if(typeof ref === "undefined" || ref === null) {
            isValid = false;
        }

        if(isValid) {
            this.setState((prevState) => {
                return {
                    ...prevState,
                    time_start: (ref === "timeStart") ? val : prevState.time_start,
                    time_end: (ref === "timeEnd") ? val : prevState.timeEnd
                };
            }, this.onExecute);
        }
    }

    onUpdateCalendar(dates) {
        const nextState = {
            ...this.state,
            selectedDates: convertRangeToArrayDate(dates)
        };

        this.setState(nextState, () => this.onExecute(nextState));
    }

    onExecute(nextState) {
        let DateAndTime = {
            Dates: this.state.selectedDates,
            Time: {
                Start: this.state.time_start,
                End: this.state.time_end
            }
        }
        if(nextState) {
            DateAndTime = {
                Dates: nextState.selectedDates,
                Time: {
                    Start: nextState.time_start,
                    End: nextState.time_end
                }
            }
        }
        if(typeof this.props.onUpdate === "function") this.props.onUpdate(DateAndTime);
        this.setState((prevState) => {
            return {
                ...prevState,
                returnObj: DateAndTime
            }
        })
        return DateAndTime;
    }

    render() {
        const TopButton = (
            <div className="Btn-Group">
                <button className={(this.state.page === 1) ? 'active': ''} onClick={() => this.toPage.bind(this)(1)}><i className="fa fa-calendar"/></button>
                <button className={(this.state.page === 2) ? 'active': ''} onClick={() => this.toPage.bind(this)(2)}><i className="fa fa-clock-o"/></button>
            </div>
        );

        return (
            <div className="basic-card-no-glow DateAndTime" value={this.state.returnObj} >
                {
                    (this.props.enableTime) ? TopButton : null
                }
                <div data-role="page-1" style={this.getPageStyle.bind(this)(1)}>
                    <DatePicker initialDates={(this.state.innerLoad) ? this.props.initialDates : []}
                        controlEnable={this.props.controlEnable}
                        initialMode={this.props.initialMode}
                        onSetDates={this.onUpdateCalendar.bind(this)}
                        isLoad={this.state.innerLoad}
                        />
                </div>
                <div data-role="page-2" style={this.getPageStyle.bind(this)(2)}>
                    <div className="item-list">
                        <div className="item">
                            <TimeInput
                                placeholder="START"
                                className="bottom-outline-1 border-focus-blue border-transition"
                                ref={(input) => this.timeStart = input}
                                onTimeChange={(val) => this.onUpdate.bind(this)(val, "timeStart")}
                                initialValue={this.props.initialTimeStart}
                                isLoad={this.state.innerLoad}
                            />
                            <label>TIME START</label>
                        </div>
                        <span>TO</span>
                        <div className="item">
                            <TimeInput
                                placeholder="END"
                                className="bottom-outline-1 border-focus-blue border-transition"
                                ref={(input) => this.timeEnd = input}
                                onTimeChange={(val) => this.onUpdate.bind(this)(val, "timeEnd")}
                                initialValue={this.props.initialTimeEnd}
                                isLoad={this.state.innerLoad}
                            />
                            <label>TIME END</label>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default DateAndTime;

DateAndTime.defaultProps = {
    onUpdate: (val) => console.log(val),
    initialDates: [],
    controlEnable: false,
    initialMode: 0,
    initialTimeStart: '',
    initialTimeEnd: '',
    isLoad: true,
    enableTime: true
}

function checkNextDate(today, nextDay) {
    let tmp = new Date(nextDay);
    tmp.setDate(nextDay.getDate() - 1);
    return today.toISOString().slice(0,10) === tmp.toISOString().slice(0,10);
}

function convertRangeToArrayDate(RangeOfDates) {
    if(RangeOfDates.constructor !== Array) return [];
    RangeOfDates = RangeOfDates.sort((a, b) => {
        if(a > b) return 1;
        if(a < b) return -1;
        return 0;
    });

    let dateChop = [];

    if(RangeOfDates.length === 0) dateChop = [];
    else if(RangeOfDates.length === 1) dateChop = RangeOfDates;
    else {
        let start = RangeOfDates[0];
        let end = RangeOfDates[0];

        for(let i = 1; i < RangeOfDates.length; i++) {
            if(checkNextDate(end, RangeOfDates[i]) && i !== RangeOfDates.length-1) {
                end = RangeOfDates[i];
            } else {
                if(i === RangeOfDates.length - 1) {
                    if(checkNextDate(end, RangeOfDates[i])) end = RangeOfDates[i];
                }
                if(start.toISOString().slice(0,10) === end.toISOString().slice(0,10)) dateChop.push(start);
                else dateChop.push([start, end]);
                start = RangeOfDates[i];
                end = RangeOfDates[i];
            }
            if(i === RangeOfDates.length - 1) {
                if(start.toISOString().slice(0,10) === end.toISOString().slice(0,10)) {
                    if(dateChop[dateChop.length-1].constructor === Array ) {
                        if((dateChop[dateChop.length-1][1].toISOString().slice(0,10) !== start.toISOString().slice(0,10))) {
                            dateChop.push(start);
                        }
                    }
                    else if(dateChop[dateChop.length-1].toISOString().slice(0,10) !== start.toISOString().slice(0,10)) {
                        dateChop.push(start);
                    }
                }
            }
        }
    }

    return dateChop;
}

function convertArrayDateToRange(ArrayOfDates) {
    let DayRange = [];
    ArrayOfDates.forEach((item) => {
        if(item.constructor === Array) {
            DayRange = DayRange.concat(generateDayRange(item[0], item[1]))
        } else {
            DayRange.push(item);
        }
    })
    return DayRange;
}

function generateDayRange(from, to) {
    if(!from || !to || from === null || to === null) return [];
    let tmp = new Date(from);
    let tmp2 = new Date(to);
    let new_array = [];
    const { daysOfWeek, after, before } = this.state.disabledDays;
    while(tmp.getTime() <= tmp2.getTime()) {
        if(after !== null || before !== null) {
            new_array.push(new Date(tmp));
        } else if(daysOfWeek.indexOf(tmp.getDay()) === -1) {
            new_array.push(new Date(tmp));
        }
        tmp.setDate(tmp.getDate() + 1);
    }

    return new_array;
}

const defaultStyle = {
    'display': 'flex',
    'justifyContent': 'center',
    'alignItems': 'center'
}
