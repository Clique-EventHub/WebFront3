import React, { Component } from 'react';
// import axios from 'axios';
import EventDetailFix from '../container/eventDetail2';
import $ from 'jquery';
import './style/calendar.css';
import { getEvent } from '../actions/common'

Date.prototype.addDays = function(days) {
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
}

Date.prototype.getMonthName = function(index) {
    const i = (!index) ? this.getMonth() : index;
    const month = ["January", "Feburary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return month[i];
}

Date.prototype.getMonthDays = function(index) {
    const year = this.getFullYear();
    let FebDay = 28;

    if(year%4 === 0) {
        FebDay = 29;
        if(year%100 === 0) {
            FebDay = 28;
            if(year%400 === 0) {
                FebDay = 29;
            }
        }
    }

    const i = (!index) ? this.getMonth() : index;

    const dayOfMonth = [31, FebDay, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return dayOfMonth[i];
}

Date.prototype.getStartOfMonth = function() {
    let dat = new Date(this.valueOf());
    dat.setDate(1);
    return dat;
}

Date.prototype.getPreviousMonth = function() {
    let dat = new Date(this.valueOf());
    dat.setHours(0, 0, 0, 0);
    dat.setMonth( this.getMonth() -1 );
    return dat;
}

Date.prototype.getNextMonth = function() {
    let dat = new Date(this.valueOf());
    dat.setHours(0, 0, 0, 0);
    dat.setMonth( this.getMonth() + 1 );
    return dat;
}

class EventBlob extends Component {
    constructor(props) {
        super(props);
        this.onStartMarquee = this.onStartMarquee.bind(this);
        this.onStopMarquee = this.onStopMarquee.bind(this);
    }

    onStartMarquee() {
        let containerWidth = this.refs.container.offsetWidth;
        let textWidth = this.refs.text.offsetWidth + 10;

        if(containerWidth < textWidth) {
            let scrollDistance = textWidth - containerWidth;
            let container = $(this.refs.container);

            let timeScroll = (scrollDistance >= 20) ? 2000 : (scrollDistance >= 10) ? 1000 : 500;

            container.stop();
            container.animate({scrollLeft: scrollDistance}, timeScroll, 'linear');
        }
    }

    onStopMarquee() {
        let container = $(this.refs.container);
        container.stop();
        container.animate({scrollLeft: 0}, 'medium', 'swing');
    }

    render() {
        return (
            <div ref="container" className={`EventBlob ${ (this.props.color) ? this.props.color : '' }`} onMouseOver={this.onStartMarquee} onMouseLeave={this.onStopMarquee} onClick={this.props.onClickEvent}>
                <span ref="text">
                    {this.props.name}
                </span>
            </div>
        );
    }
}

const DayInfo = (props) => {
    const cn = "DayInfo";
    return (
        <div className={cn}>
            <div style={{'color': '#000', 'border': 'none', 'position': 'absolute', 'top': '10px', 'right': '10px'}}>{props.date}</div>
            <div className="Blob-Container">
                {props.Events.map((item, index) => { return <EventBlob key={`${props.keyName}-${index}`} name={item.name} color={`color-${item.color}`} onClickEvent={props.onClickEvent} />})}
            </div>
        </div>
    );
}

class Calendar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            'refDate': new Date().setHours(0, 0, 0, 0),
            'DateState': [],
            'events': []
            // [
            //     {
            //         'from': new Date("2017-06-10"),
            //         'to': new Date("2017-06-20"),
            //         'name': "Dream",
            //         'eventId': '',
            //         'color': 'blue',
            //         'nudge': 0
            //     },
            //     {
            //         'from': new Date("2017-06-11"),
            //         'to': new Date("2017-06-15"),
            //         'name': "Of",
            //         'eventId': '',
            //         'color': 'yellow',
            //         'nudge': 1
            //     },
            //     {
            //         'from': new Date("2017-06-30"),
            //         'to': new Date("2017-07-02"),
            //         'name': "La La La",
            //         'eventId': '',
            //         'color': 'green',
            //         'nudge': 0
            //     },
            //     {
            //         'from': new Date("2017-06-24"),
            //         'to': new Date("2017-06-26"),
            //         'name': "LOL",
            //         'eventId': '',
            //         'color': 'red',
            //         'nudge': 0
            //     },
            //     {
            //         'from': new Date("2017-06-11"),
            //         'to': new Date("2017-06-14"),
            //         'name': "LOL LOL LOL",
            //         'eventId': '',
            //         'color': 'pink',
            //         'nudge': 2
            //     },
            //     {
            //         'from': new Date("2017-06-21"),
            //         'to': new Date("2017-06-21"),
            //         'name': "more...",
            //         'eventId': '',
            //         'color': 'blue',
            //         'nudge': 0
            //     },
            //     {
            //         'from': new Date("2017-06-15"),
            //         'to': new Date("2017-06-16"),
            //         'name': "I spy with little eyes",
            //         'eventId': '',
            //         'color': 'red',
            //         'nudge': 0
            //     },
            //     {
            //         'from': new Date("2017-06-16"),
            //         'to': new Date("2017-06-18"),
            //         'name': "La La Land",
            //         'eventId': '',
            //         'color': 'pink',
            //         'nudge': 0
            //     }

        }

        this.onClickPrev = this.onClickPrev.bind(this);
        this.onClickNext = this.onClickNext.bind(this);
        this.setDateGrid = this.setDateGrid.bind(this);
        this.EventInDay = this.EventInDay.bind(this);
        this.onSetCalendar = this.onSetCalendar.bind(this);
        this.onDateClick = this.onDateClick.bind(this)
        this.onItemPopUpClick = this.onItemPopUpClick.bind(this);
        this.onClickEvent = this.onClickEvent.bind(this);
        this.getEventInfo = this.getEventInfo.bind(this);
    }

    getEventInfo(nextProps) {
        let eventPromises = [];
        let color = ['red','pink','yellow','green','blue'];
        let i;

        for(i = 0; i < nextProps.user.events.general.join.length; i++){
            eventPromises.push(getEvent(nextProps.user.events.general.join[Number(i)], false));
        }
        for(i = nextProps.user.events.general.join.length; i < nextProps.user.events.general.join.length+nextProps.user.events.general.interest.length; i++) {
            eventPromises.push(getEvent(nextProps.user.events.general.interest[Number(i)], false));
        }

        return Promise.all(eventPromises).then((datas) => {
            return datas.map((data, index) => {
                return (
                    {
                        'from': new Date(data.date_start),
                        'to': new Date(data.date_end),
                        'name': data.title,
                        'eventId': data._id,
                        'color': color[index%5],
                        'nudge': 0
                    }
                );
            })
        });
    }

    compareDate(day1, day2) {
        return (day1.getFullYear() === day2.getFullYear()) && (day1.getMonth() === day2.getMonth()) && (day1.getDate() === day2.getDate());
    }

    onClickPrev() {
        this.onSetCalendar(new Date(this.state.refDate).getPreviousMonth());
    }

    onClickNext() {
        this.onSetCalendar(new Date(this.state.refDate).getNextMonth());
    }

    onSetNudge(dateStart, dateEnd, dateState) {
        //Assume dateStart and dateEnd is in the same month
        let i = 0;
        while(i < 3) {
            if(dateState[dateStart.getDate()-1][i]) {
                for(let tmp = dateStart.getDate()-1; tmp < dateEnd.getDate(); tmp++) {
                    dateState[tmp][i] = false;
                }
                return i;
            }
            i++;
        }
        return i;
    }

    onItemPopUpClick(item) {
        this.props.set_pop_up_item(item);
        this.props.toggle_pop_item();
    }

    onClickEvent() {
        this.onItemPopUpClick(<EventDetailFix onToggle={this.props.toggle_pop_item} onSetItem={this.props.set_pop_up_item} />);
    }

    setDateGrid(dateStart, dateEnd, color, nudgeNo, name, DateState, index) {
        const startOfMonth = new Date(this.state.refDate).getStartOfMonth();
        const SOMDay = startOfMonth.getDay();
        const monthDay = startOfMonth.getMonthDays();
        const thisMonth = new Date(this.state.refDate).getMonth();
        //const nudge = (!nudgeNo) ? '' : ` Nudge-${nudgeNo}`

        let row = Math.floor( (SOMDay + dateStart.getDate() - 1)/7) + 1;
        let col = (SOMDay + dateStart.getDate() + 6)%7 + 1;
        let wRange = (dateEnd.getDate() - dateStart.getDate() + 1);

        if(dateStart.getMonth() === dateEnd.getMonth() && thisMonth === dateStart.getMonth()) {
            let nudgeNum = this.onSetNudge(dateStart, dateEnd, DateState);
            let nudge = `Nudge-${nudgeNum}`;
            if(nudgeNum >= 3) return null;
            if(!this.compareDate(dateStart, dateEnd) && (dateStart.getDay() >= dateEnd.getDay() || wRange >= 7)) {
                let content = [];
                let i = 1;
                content.push(<div key={`${0}-event`} className={`EventRange w-${7-dateStart.getDay()} pos-${row}-${col} color-${color} BuntEnd ${nudge}`}>{name}</div>);
                wRange -= 7-dateStart.getDay();
                while(wRange > 7) {
                    content.push(<div key={`${i}-event`} className={`EventRange w-${7} pos-${row + i}-${1} color-${color} BuntStart BuntEnd ${nudge}`}>{name}</div>);
                    wRange -= 7;
                    i++;
                }
                content.push(<div key={`${i}-event`} className={`EventRange w-${wRange} pos-${row + i}-${1} color-${color} BuntStart ${nudge}`}>{name}</div>);

                return (<div key={index} onClick={this.onClickEvent} className="EventRange-Container">{content}</div>);
            }


            return (<div key={index} onClick={this.onClickEvent} className="EventRange-Container"><div className={`EventRange w-${wRange} pos-${row}-${col} color-${color} ${nudge}`}>{name}</div></div>);
        } else if(dateStart.getMonth() < thisMonth && thisMonth < dateEnd.getMonth() ) {
            let content =[];
            let i = 1;
            let nudgeNum = this.onSetNudge(startOfMonth, startOfMonth.addDays(monthDay-1), DateState);
            let nudge = `Nudge-${nudgeNum}`;
            if(nudgeNum >= 2) return null;
            content.push(<div key={`${0}-event`} className={`EventRange w-${7 - SOMDay} pos-${1}-${SOMDay + 1} color-${color} BuntStart BuntEnd ${nudge}`}>{name}</div>);
            wRange = monthDay - (7 - SOMDay);
            while(wRange > 7) {
                content.push(<div key={`${i}-event`} className={`EventRange w-${7} pos-${i+1}-${1} color-${color} BuntStart BuntEnd ${nudge}`}>{name}</div>)
                wRange -= 7;
                i++;
            }
            content.push(<div key={`${i}-event`} className={`EventRange w-${wRange} pos-${i+1}-${1} color-${color} BuntStart BuntEnd ${nudge}`}>{name}</div>);
            return (<div key={index} onClick={this.onClickEvent} className="EventRange-Container">{content}</div>);
        } else if(dateStart.getMonth() !== dateEnd.getMonth()) {
            if(dateStart.getMonth() === thisMonth) {
                let nudgeNum = this.onSetNudge(dateStart, startOfMonth.addDays(monthDay-1), DateState);
                let nudge = `Nudge-${nudgeNum}`;
                if(nudgeNum >= 2) return null;
                if(row === Math.ceil((SOMDay + monthDay)/7)) {
                    return (<div key={index} onClick={this.onClickEvent} className="EventRange-Container"><div className={`EventRange w-${monthDay - dateStart.getDate() + 1} pos-${row}-${col} color-${color} BuntEnd ${nudge}`}>{name}</div></div>);
                }
                else {
                    let content = [];
                    let i = 1;
                    wRange = monthDay - dateStart.getDate() + 1;

                    content.push(<div key={`${0}-event`} className={`EventRange w-${7-dateStart.getDay()} pos-${row}-${col} color-${color} BuntEnd ${nudge}`}>{name}</div>);

                    wRange -= 7-dateStart.getDay();
                    while(wRange > 7) {
                        content.push(<div key={`${i}-event`} className={`EventRange w-${7} pos-${row + i}-${1} color-${color} BuntStart BuntEnd ${nudge}`}>{name}</div>)
                        wRange -= 7;
                        i++;
                    }

                    content.push(<div key={`${i}-event`} className={`EventRange w-${wRange} pos-${row + i}-${1} color-${color} BuntStart BuntEnd ${nudge}`}>{name}</div>);

                    return (<div key={index} onClick={this.onClickEvent} className="EventRange-Container">{content}</div>);
                }
            } else if(dateEnd.getMonth() === thisMonth) {
                let content = [];
                let i = 1;
                let nudgeNum = this.onSetNudge(startOfMonth, dateEnd, DateState);
                let nudge = `Nudge-${nudgeNum}`;
                if(nudgeNum >= 2) return null;
                wRange = dateEnd.getDate();

                //Position of end date
                row = Math.floor( (SOMDay + dateEnd.getDate() - 1)/7) + 1;
                col = (SOMDay + dateEnd.getDate() + 6)%7 + 1;

                if(row === 1) {
                    row = 1;
                    col = SOMDay + 1;
                    return (<div key={index} onClick={this.onClickEvent} className="EventRange-Container"><div className={`EventRange w-${dateEnd.getDay() - SOMDay + 1} pos-${row}-${col} color-${color} BuntStart ${nudge}`}>{name}</div></div>);
                } else {
                    content.push(<div key={`${0}-event`} className={`EventRange w-${7 - SOMDay} pos-${1}-${SOMDay + 1} color-${color} BuntStart BuntEnd ${nudge}`}>{name}</div>);
                    wRange = dateEnd.getDate() - (7 - SOMDay);
                    while(wRange > 7) {
                        content.push(<div key={`${i}-event`} className={`EventRange w-${7} pos-${i+1}-${1} color-${color} BuntStart BuntEnd ${nudge}`}>{name}</div>)
                        wRange -= 7;
                        i++;
                    }

                    content.push(<div key={`${i}-event`} className={`EventRange w-${wRange} pos-${i+1}-${1} color-${color} BuntStart ${nudge}`}>{name}</div>)

                    return (<div key={index} onClick={this.onClickEvent} className="EventRange-Container">{content}</div>);
                }
            }
        }
        return null;
    }

    EventInDay(day) {
        return this.state.events.filter((item) => {
            if(this.compareDate(day, item.from)) return true;
            return (item.from.getTime() <= day.getTime() && day.getTime() <= item.to.getTime())
        });
    }

    onSetCalendar(refDate) {
        //When month is changed
        const startOfMonth = new Date(refDate).getStartOfMonth();
        const monthDay = startOfMonth.getMonthDays();

        let new_state = [];
        for(var i = 0; i < monthDay; i++) {
            new_state.push(false);
        }

        this.setState({
            ...(this.state),
            'DateState': new_state,
            'refDate': refDate
        });
    }

    componentWillMount() {
        this.onSetCalendar(new Date(this.state.refDate));
        let sortedEvents = [...this.state.events];
        sortedEvents = sortedEvents.sort((a, b) => {
            if(a.from < b.from) return -1;
            else if(a.from > b.from) return 1;
            return 0;
        });
        this.setState({
            ...(this.state),
            'events': sortedEvents
        });
    }

    componentWillReceiveProps(nextProps) {
        this.onSetCalendar(new Date(this.state.refDate));
        this.getEventInfo(nextProps).then((events) => {
            let sortedEvents = events;
            sortedEvents = sortedEvents.sort((a, b) => {
                if(a.from < b.from) return -1;
                else if(a.from > b.from) return 1;
                return 0;
            });

            this.setState((prevState) => {
                return {
                    ...prevState,
                    'events': sortedEvents
                }
            })
        })
    }

    onDateClick(date) {
        const startOfMonth = new Date(this.state.refDate).getStartOfMonth();
        const monthDay = startOfMonth.getMonthDays();

        if(date <= 0 || date > monthDay) return;
        let new_state = [...this.state.DateState];
        if(new_state.indexOf(true) !== date-1) new_state[new_state.indexOf(true)] = false;
        new_state[date - 1] = !new_state[date - 1];
        this.setState({
            ...(this.state),
            'DateState': new_state
        })
    }

    render() {

        const refDate = new Date(this.state.refDate);

        const startOfMonth = new Date(this.state.refDate).getStartOfMonth();
        const SOMDay = startOfMonth.getDay();
        const monthDay = startOfMonth.getMonthDays();
        const dayName = ["SUNDAY", "MONDAY", "TUESDAY", "WEDESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

        let DateAvalible = [];
        for(let i = 0; i < monthDay; i++) {
            DateAvalible.push([true, true, true]);
        }

        const totalDayRendered = Math.ceil((SOMDay + monthDay)/7)*7;
        let dayRef = new Date(startOfMonth);

        let Days = [];
        for(let i = 0; i < totalDayRendered; i++) {
            let cn = "Day ";
            if(i >= SOMDay && i < (monthDay + SOMDay)) {
                if((i === SOMDay + refDate.getDate() - 1) && this.compareDate(refDate, new Date())) cn += "Today";
            } else {
                cn += "Disabled";
            }

            Days.push(
            <div className={cn} key={i+1} onClick={(e) => {
                    if(e.target.className === "Day " || e.target.className === "DayInfo" ||  e.target.className === "Day Today" || e.target.className === "Blob-Container") {
                        this.onDateClick(i - SOMDay + 1);
                    }
                }}>
                {(i >= SOMDay && i < (monthDay + SOMDay)) ? (i - SOMDay + 1) : ''}
                {(i >= SOMDay && i < (monthDay + SOMDay) && this.state.DateState[i - SOMDay]) ? <DayInfo Events={this.EventInDay(new Date(dayRef))} key={`Date-${i - SOMDay + 1}`} keyName={`Date-${i - SOMDay + 1}`} date={i - SOMDay + 1} onClickEvent={this.onClickEvent} /> : null}
                {(this.EventInDay(new Date(dayRef)).length > 0) ? (<div style={{'position': 'absolute', 'bottom': '5px', 'left': '5px', 'fontSize': '0.75em', 'color': '#AAA'}}>{this.EventInDay(new Date(dayRef)).length}</div>) : null}
            </div>)

            if(i >= SOMDay && i < (monthDay + SOMDay)) dayRef = dayRef.addDays(1);
        }

        let CalendarBody = (
            <div className="Body">
                <div className="Week">
                    {dayName.map((item, index) => (<div key={`Day-${index}`} className="Day text-center">{item}</div>))}
                </div>
                <div className={`Days d-${Math.ceil((SOMDay + monthDay)/7)}`}>
                    {Days}
                </div>
                {this.state.events.map((item, index) => {
                    return (this.setDateGrid(item.from, item.to, item.color, item.nudge, item.name, DateAvalible, index))
                })}
            </div>
        );

        return (
            <div className="Calendar-Container">
                <div className="Calendar">
                    <div className="Head">
                        <button className="invisible square-round" onClick={this.onClickPrev}>
                            <i className="fa fa-angle-left" aria-hidden="true"></i>
                        </button>
                        <span>
                            {refDate.getMonthName().toUpperCase()}
                        </span>
                        <button className="invisible square-round" onClick={this.onClickNext}>
                            <i className="fa fa-angle-right" aria-hidden="true"></i>
                        </button>
                        <div>
                            {refDate.getFullYear()}
                        </div>
                    </div>
                    {CalendarBody}
                </div>
            </div>
        );
    }
}

export default Calendar;
