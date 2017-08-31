import React , { Component } from 'react';
import pages from '../hoc/pages';
import normalPage from '../hoc/normPage';
import './css/tablePage.css';
import axios from 'axios';
import { hostname } from '../actions/index';
import { getRandomShade, getCookie, getEvent } from '../actions/common';
import ErrorPopUp from '../components/ErrorPopUp';
import ReactLoading from 'react-loading';
import { CSVLink } from 'react-csv';
import _ from 'lodash';

class tablePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            'formId': null,
            'formData': null,
            'formTitle': null,
            'eventName': null,
            'selectedCell': {
                'row': null,
                'col': null
            },
            'selectedRows': new Set(),
            'tableData': [],
            'filteredDataFlags': [],    //sampleData => this.state.tableData?
            'filterKeyword': '',
            'keys': [],
            'eventId': _.get(this.props, 'location.query.eid', ''),
            'joined': [],
            'refObj': null,
            'whoJoined': {},
            'whoRejected': {},
            'whoAccepted': {},
            'whoCompleted': {},
            'whoInterest': {},
            'whoPending': {}
        }

        this.onHightLight = this.onHightLight.bind(this);
        this.onClickCell = this.onClickCell.bind(this);
        this.onMouseLeaveTable = this.onMouseLeaveTable.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.onFilterSearch = this.onFilterSearch.bind(this);
        this.checkDisable = this.checkDisable.bind(this);
        this.onSetError = this.onSetError.bind(this);
        this.onClickApprove = this.onClickApprove.bind(this);
        this.onUpdateStatus = this.onUpdateStatus.bind(this);
        this.onUpdateTable = this.onUpdateTable.bind(this);
        this.onClickCheckIn = this.onClickCheckIn.bind(this);
        this.onClickReject = this.onClickReject.bind(this);
        this.onClickSendMessage = this.onClickSendMessage.bind(this);

        // this.onMouseMove = this.onMouseMove.bind(this);
    }

    onSetError(error) {
        this.props.blur_bg();
        if(error.response) {
            this.props.set_pop_up_item(<ErrorPopUp onExit={this.props.toggle_pop_item} errorMsg={`Oh! Ow! something went wrong!`} errorDetail={`Got Error code: ${error.response.status} with message "${error.response.data.err}"`} />);
        } else {
            this.props.set_pop_up_item(<ErrorPopUp onExit={this.props.toggle_pop_item} errorMsg={`Oh! Ow! something went wrong!`} errorDetail="Please check your internet connection" />);
        }
        this.props.display_pop_item();
    }

    onClickApprove() {
        const ids = Array.from(this.state.selectedRows).map((row) => {
            return (this.state.joined[row-1]._id);
        });

        const config = {
            'headers': {
                'Authorization': ('JWT ' + getCookie("fb_sever_token"))
            }
        }

        axios.put(`${hostname}admin/event/choose?id=${this.state.eventId}`, {
            'yes': ids
        } , config).then((data) => {
            this.onUpdateStatus();
        }).catch((e) => {
            // console.log(e);
        })
    }

    onClickReject() {
        const ids = Array.from(this.state.selectedRows).map((row) => {
            return (this.state.joined[row-1]._id);
        });

        const config = {
            'headers': {
                'Authorization': ('JWT ' + getCookie("fb_sever_token"))
            }
        }

        axios.put(`${hostname}admin/event/choose?id=${this.state.eventId}`, {
            'no': ids
        } , config).then((data) => {
            this.onUpdateStatus();
        }).catch((e) => {
            // console.log(e);
        })
    }

    onClickSendMessage() {
        const ids = Array.from(this.state.selectedRows).map((row) => {
            return (this.state.joined[row-1]._id);
        });

        const config = {
            'headers': {
                'Authorization': ('JWT ' + getCookie("fb_sever_token"))
            }
        }

        axios.post(`${hostname}event/join/message?id=${this.state.eventId}`, {
            'description': this.messageInput.value,
            'people': ids
        } , config).then((data) => {
            this.onUpdateStatus();
        }).catch((e) => {
            // console.log(e);
        })
    }

    onClickCheckIn() {
        const ids = Array.from(this.state.selectedRows).map((row) => {
            return (this.state.joined[row-1]._id);
        });

        const config = {
            'headers': {
                'Authorization': ('JWT ' + getCookie("fb_sever_token"))
            }
        }

        axios.put(`${hostname}admin/check-in?id=${this.state.eventId}`, {
            'users': ids
        } , config).then((data) => {
            this.onUpdateStatus();
        }).catch((e) => {
            // console.log(e);
        })
    }

    onClickCell(row, col) {
        //console.log("click");
        if(this.state.selectedRows.has(row)) {
            if(this._isMounted) {
                this.setState((prevState) => {
                    let new_rows = prevState.selectedRows
                    new_rows.delete(row);

                    return ({
                        ...prevState,
                        'selectedRows': new_rows
                    });
                })
            }
        } else {
            if(this._isMounted) {
                this.setState((prevState) => {
                    let new_rows = prevState.selectedRows;
                    new_rows.add(row);
                    return ({
                        ...prevState,
                        'selectedRows': new_rows
                    });
                })
            }
        }

        if(row > 0) {
            const selected_cell = this.refs["main-table"].children[1].children[row-1].children[col];
            if(this.state.selectedCell.row === row && this.state.selectedCell.col === col)
            {
                const optionsWidth = 120;
                const optionHeight = 100
                const options = this.refs["options"];

                options.style.height = `${optionHeight}px`;
                options.style.width = `${optionsWidth}px`;

                const nextOptionState = false;

                let countFiltered = 0;
                this.state.filteredDataFlags.forEach((item) => {
                    if(item) countFiltered++;
                })

                let top = `${selected_cell.offsetTop - 15}px`;
                if(row === countFiltered) {
                    top = `${selected_cell.offsetTop + 1 - optionHeight + selected_cell.offsetHeight}px`;
                }

                if(this.refs["main-table"].children[0].children.length === (col+1)) {
                    options.style.left = `${selected_cell.offsetLeft + 1 - 200}px`;
                    options.style.top = top;
                    options.style.display = (nextOptionState) ? 'block' : 'none';
                } else {
                    options.style.left = `${selected_cell.offsetLeft + 1 + selected_cell.offsetWidth}px`;
                    options.style.top = top;
                    options.style.display = (nextOptionState) ? 'block' : 'none';
                }
            } else {
                if(this._isMounted) {
                    this.setState((prevState) => {
                        return ({
                            ...prevState,
                            'selectedCell': {
                                'row': row,
                                'col': col
                            }
                        });
                    })
                }

                const sc = this.refs["sc"];
                const sr = this.refs["sr"];

                sc.style.height = `${this.refs["main-table"].offsetHeight}px`;
                sc.style.display = "block";
                sc.style.top = "0px";
                sc.style.left = `${selected_cell.offsetLeft+1}px`;
                sc.style.width = `${selected_cell.offsetWidth}px`;

                sr.style.height = `${selected_cell.offsetHeight}px`;
                sr.style.width = `${this.refs["main-table"].offsetWidth}px`;
                sr.style.top = `${selected_cell.offsetTop+1}px`;
                sr.style.left = "0px";
                sr.style.display = "block";
            }
        }
    }

    onHightLight(row, col) {
        const hc = this.refs["hc"];
        const hr = this.refs["hr"];

        let selected_cell;
        if(row === 0) {
            selected_cell = this.refs["main-table"].children[0].children[col];
        } else {
            selected_cell = this.refs["main-table"].children[1].children[row-1].children[col];
        }

        hc.style.height = `${this.refs["main-table"].offsetHeight}px`;
        hc.style.display = "block";
        hc.style.top = "0px";
        hc.style.left = `${selected_cell.offsetLeft+1}px`;
        hc.style.width = `${selected_cell.offsetWidth}px`;

        hr.style.height = `${selected_cell.offsetHeight}px`;
        hr.style.width = `${this.refs["main-table"].offsetWidth}px`;
        hr.style.top = `${selected_cell.offsetTop+1}px`;
        hr.style.left = "0px";
        hr.style.display = "block";
    }

    onMouseLeaveTable() {
        this.refs["hc"].style.display = "none";
        this.refs["hr"].style.display = "none";
    }

    componentDidMount() {
        document.addEventListener('keydown', this.onKeyPress);
        this._isMounted = true;
    }

    compnentWillUnMount() {
        document.removeEventListener('keydown', this.onKeyPress);
        this._isMounted = false;
    }

    onUpdateStatus() {
        const config = {
            'headers': {
                'Authorization': ('JWT ' + getCookie('fb_sever_token')),
                'crossDomain': true
            }
        }

        axios.get(`${hostname}event/stat?id=${this.state.eventId}`, config).then(
            (data) => data.data
        ).then((data) => {
            if(this._isMounted) {
                this.setState((prevState) => {
                    let whoJoined = {};
                    let whoAccepted = {};
                    let whoInterested = {};
                    let whoRejected = {};
                    let whoCompleted = {};
                    let whoPending = {};

                    _.get(data, 'who_join', []).forEach((id) => whoJoined[id] = true);
                    _.get(data, 'who_accepted', []).forEach((id) => whoAccepted[id] = true);
                    _.get(data, 'who_interest', []).forEach((id) => whoInterested[id] = true);
                    _.get(data, 'who_rejected', []).forEach((id) => whoRejected[id] = true);
                    _.get(data, 'who_completed', []).forEach((id) => whoCompleted[id] = true);
                    _.get(data, 'who_pending', []).forEach((id) => whoPending[id] = true);

                    return {
                        ...prevState,
                        whoJoined: whoJoined,
                        whoAccepted: whoAccepted,
                        whoInterested: whoInterested,
                        whoRejected: whoRejected,
                        whoCompleted: whoCompleted,
                        whoPending: whoPending
                    }
                }, this.onUpdateTable)
            }
        })
    }

    onUpdateTable() {
        // let new_tableData = this.state.tableData;
        let new_tableData = _.get(this.state, 'joined', []).map(
        (item) => {
            let isAccepted = false;
            let isCompleted = false;

            if(typeof this.state.whoAccepted[item._id] !== "undefined") {
                isAccepted = true;
            }
            if(typeof this.state.whoCompleted[item._id] !== "undefined") {
                isCompleted = true;
            }

            let row = [isAccepted, isCompleted];

            _.get(this.state, 'keys', []).forEach((key, index) => {
                if(["approved", "check in"].indexOf(key) === -1)
                    row.push(item[key])
            });

            return row;
        })

        this.setState((prevState) => {
            return {
                ...prevState,
                'tableData': new_tableData
            }
        })
    }

    componentWillMount() {
        document.title = "Event Hub | Table";

        const config = {
            'headers': {
                'Authorization': ('JWT ' + getCookie('fb_sever_token')),
                'crossDomain': true
            }
        }

        let _this = this;

        axios.get(`${hostname}event/stat?id=${this.state.eventId}`, config).then((data) => {
            let joined = _.get(data.data, 'join_data', []);
            let keys = new Set();
            let keysArray = [];
            joined.forEach((item) => {
                Object.keys(item).forEach((key) => keys.add(key))
            });
            keysArray = ["approved", "check in"].concat(Array.from(keys)).filter((item) => item !== "_id");
            if(this._isMounted) {
                this.setState((prevState) => {

                    let whoJoined = {};
                    let whoAccepted = {};
                    let whoInterested = {};
                    let whoRejected = {};
                    let whoCompleted = {};
                    let whoPending = {};

                    _.get(data.data, 'who_join', []).forEach((id) => whoJoined[id] = true);
                    _.get(data.data, 'who_accepted', []).forEach((id) => whoAccepted[id] = true);
                    _.get(data.data, 'who_interest', []).forEach((id) => whoInterested[id] = true);
                    _.get(data.data, 'who_rejected', []).forEach((id) => whoRejected[id] = true);
                    _.get(data.data, 'who_completed', []).forEach((id) => whoCompleted[id] = true);
                    _.get(data.data, 'who_pending', []).forEach((id) => whoPending[id] = true);

                    return {
                        ...prevState,
                        keys: keysArray,
                        joined: joined,
                        refObj: data.data,
                        whoJoined: whoJoined,
                        whoAccepted: whoAccepted,
                        whoInterested: whoInterested,
                        whoRejected: whoRejected,
                        whoCompleted: whoCompleted,
                        whoPending: whoPending
                    }
                })
            }

            let allData = [];
            for(let i = 0; i < joined.length; i++){
              var row = [false, false];
                keysArray.forEach((key, index) => {
                    if(index > 1) {
                        row.push(joined[i][key])
                    }
                })
                //let row = [false, false, "", joined[i].firstNameTH, joined[i].lastNameTH, joined[i].nick_name, "", joined[i].phone, "", joined[i].firstName+" "+joined[i].lastName, "", joined[i].disease];
                allData.push(row);
            }

            const formObj = _.get(data.data, 'forms[0]', {});
            const formTitle = _.get(formObj, 'title', '');
            const formId = _.get(formObj, 'id', '');
            alert("LOWER");
            console.log(data.data);

            if(this._isMounted) {
                this.setState((prevState) => {
                    return ({
                        ...prevState,
                        formId,
                        formTitle,
                        'tableData': allData,
                        'filterDataFlags': allData.map(() => true),
                        'eventName': _.get(data, 'title', '')
                    })
                }, this.onUpdateTable)
            }

            if(formId !== '') {
                alert("OUTSIDE");
                axios.get(`${hostname}form?id=${formId}&opt=responses`, config).then((data) => {
                    if(this._isMounted) {
                        this.setState((prevState) => {
                            const responses = _.get(data.data, 'form.responses', []);
                            let new_joined = [...joined];
                            alert("INSIDE")
                            console.log(responses);
                            responses.forEach((item) => {
                                const id = item._id;
                                const index = new_joined.findIndex((item) => item._id === id);
                                if(index !== -1) {
                                    new_joined[index].response = item.answers.responses;
                                }
                            })


                            return ({
                                ...prevState,
                                'formData': data.data.form,
                                'responses': data.data.form.responses,
                                'joined': new_joined
                            });
                        });
                    }
                })
            }
        }).catch((e) => {
            this.onSetError(e);
        });

        /*
        getEvent(this.state.eventId).then((data) => {
            const formObj = _.get(data, 'forms[0]', {});
            const formTitle = _.get(formObj, 'title', '');
            const formId = _.get(formObj, 'id', '');
            console.log(formObj);

            if(this._isMounted) {
                this.setState((prevState) => {
                    return ({
                        ...prevState,
                        formId,
                        formTitle,
                        'eventName': _.get(data, 'title', '')
                    })
                })
            }

            return formId;
        }).then((formId) => {
            if(formId !== '') {
                axios.get(`${hostname}form?id=${formId}&opt=responses`, config).then((data) => {
                    if(this._isMounted) {
                        this.setState((prevState) => {

                            const responses = _.get(data.data, 'form.responses', []);
                            let new_joined = _.get(this.state, 'joined', []);
                            responses.forEach((item) => {
                                const id = item._id;
                                const index = new_joined.findIndex((item) => item._id === id);
                                if(index !== -1) {
                                    new_joined[index].response = item.answers.responses;
                                }
                            })

                            return ({
                                ...prevState,
                                'formData': data.data.form,
                                'responses': data.data.form.responses,
                                'joined': new_joined
                            });
                        });
                    }
                })
            }
        }).catch((e) => {
            // console.log(e.response);
            this.onSetError(e);
        });
        */
    }

    componentDidUpdate() {
       // console.log(this.state);
    }

    onKeyPress(e) {
        e = e || window.event;
        if(e.keyCode === 27) {
            if(this._isMounted) {
                this.setState((prevState) => {
                    return ({
                        ...prevState,
                        'selectedCell': {
                            'row': null,
                            'col': null
                        }
                    });
                });

                this.refs["sr"].style.display = "none";
                this.refs["sc"].style.display = "none";
                this.refs["options"].style.display = "none";
            }
        }
    }

    filter(arrayOfFields, key) {
        let isFound = false;
        for(let i = 0; i < arrayOfFields.length && !isFound; i++) {
            const Item = arrayOfFields[i] || '';
            if(Item.toString().toUpperCase().includes(key.toUpperCase())) { isFound = true; }
        }
        return isFound;
    }

    onFilterSearch() {
        const keyword = this.refs.filterSearch.value;

        if(this._isMounted) {
            this.setState((prevState) => {
                return ({
                    ...prevState,
                    'filterKeyword': keyword,
                    'filteredDataFlags': this.state.tableData.map((item) => this.filter(item, keyword))
                })
            });
        }
    }

    checkDisable() {
        return (this.state.selectedRows.size === 0);
    }

    render() {
        let csvData = [["No.", ..._.get(this.state, 'keys', [])]];
        let count = 1;
        this.state.tableData.forEach((person, index) => {
            if(this.state.filteredDataFlags[index]) csvData.push([count++, ...person]);
        });

        count = 0;

        return (
            <div className="table-page">
                <section className="table-top">
                    <div className="table-name">
                        <h1>{this.state.eventName}</h1>
                    </div>
                    <div className="table-search">
                        <form onSubmit={(e) => { e.preventDefault(); return false;}}>
                            <div><i className="fa fa-search" aria-hidden="true"></i></div>
                            <input type="text" placeholder="Search" ref="filterSearch" value={this.state.filterKeyword} onChange={this.onFilterSearch}></input>
                        </form>
                    </div>
                </section>
                <section className="table-center">
                    <div className="table-main">
                        <div className="table" ref="main-table" onMouseOut={this.onMouseLeaveTable}>
                            <div className="thead">
                                <div className="th" onMouseEnter={() => {this.onHightLight(0, 0)}} >No.</div>
                                {
                                    _.get(this.state,'keys', []).map((field, index) => {
                                        return <div key={index+1} className="th" onMouseEnter={() => {this.onHightLight(0, index+1)}}>{field.replace("_", " ")}</div>
                                    })
                                }
                            </div>
                            <div className="tbody">
                                {
                                    this.state.tableData.map((person, index) => {
                                        if(!this.state.filteredDataFlags[index]) return null;
                                        count += 1;
                                        let c = count;
                                        return (
                                            <div className={`tr ${_.get(this.state, 'selectedRows', new Set()).has(c) ? 'selected' : ''}`} key={count-1}>
                                                <div className="td" onMouseEnter={() => {this.onHightLight(c, 0)}} onClick={() => {this.onClickCell(c, 0)}}>{c}</div>
                                                {
                                                    person.map((sample, col) => {
                                                        let inner = (typeof(sample) === "boolean") ? <i className={`fa fa-check ${(sample) ? '' : 'nope'}`} /> : sample
                                                        return (
                                                        <div key={`col-${col}`} className="td" onMouseEnter={() => {this.onHightLight(c, col+1)}} onClick={() => {
                                                                new Promise((res, rej) => res(true)).then(() => {this.onClickCell(c, col+1);})
                                                            }}>
                                                            {inner}
                                                        </div>);
                                                    })
                                                }
                                            </div>
                                        );
                                    })
                                }
                            </div>
                            <div className="highlight-col" ref="hc" />
                            <div className="highlight-row" ref="hr" />
                            <div className="selected-col" ref="sc" />
                            <div className="selected-row" ref="sr" />
                            <div className="options" ref="options">
                                <ul>
                                    <li onClick={() => {

                                        }}>Approve</li>
                                    <li onClick={() => {

                                        }}>Reject</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="table-bottom">
                    <div className="add-name display-none">
                        <button className="add">ADD</button>
                        <input type="text" placeholder="STUDENT ID" ref="first"></input>
                        <button>EXPORT (CSV)</button>
                    </div>
                    <div className="table-button">
                        <div className="Btn-group">
                            <button className="Btn-green" onClick={this.onClickApprove}>APPROVE</button>
                            <button className="Btn-green" onClick={this.onClickCheckIn}>CHECK IN</button>
                            <button className="Btn-red" onClick={this.onClickReject}>REJECT</button>
                        </div>
                        <div className="Input-group">
                            <input
                                type="text"
                                ref={(input) => this.messageInput = input}
                            />
                            <button
                                disabled={this.checkDisable()}
                                className={`${(this.checkDisable()) ? 'cursor-disabled' : ''}`}
                                onClick={() => {
                                    if(!this.checkDisable()) {
                                        this.onClickSendMessage();
                                    }
                                }}
                            >
                                SEND MESSAGE
                            </button>
                        </div>
                        <button><CSVLink filename={`Export-[${this.state.eventName}]-(${new Date().toString().slice(0, 10)}).csv`} data={csvData}>EXPORT (CSV)</CSVLink></button>
                    </div>
                </section>
            </div>
        );
    }
}

export default normalPage(pages(tablePage, true));
