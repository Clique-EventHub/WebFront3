import React , { Component } from 'react';
import pages from '../hoc/pages';
import normalPage from '../hoc/normPage';
import './css/tablePage.css';
import axios from 'axios';
import { hostname } from '../actions/index';
import { getRandomShade, getCookie } from '../actions/common';
import ReactLoading from 'react-loading';
import { CSVLink } from 'react-csv';

const testFormId = 2;

const fields = ["approved" ,"check in", "student id", "name", "surname", "nickname", "faculty", "tel", "line id", "facebook", "email", "MEDICAL PROBLEM"];
const sampleFields = [true, true, "5830129021", "Sam", "Saeddht", "Samy", "Engineering", "0899809988", "sam_sdt", "Sam Saeddht", "sam_sdt@gmail.com", "กินของราคาถูกไม่เป็น"]
const sampleFields_2 = [true, false, "5830130021", "Catherine", "Potlocker", "Amy", "Engineering", "0817446291", "Amy_Chan", "Kitty", "amy_kitty@gmail.com", ""]
const sampleFields_3 = [false, false, "5831033021", "Json", "Blue", "Jack", "Engineering", "0818348602", "Jackkyyy", "", "jack10384y@gmail.com", "nuts"]

const sampleData = [sampleFields, sampleFields_2, sampleFields_3];

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
            'optionActive': false,
            'tableData': sampleData,
            'filteredDataFlags': sampleData.map(() => true),
            'filterKeyword': '',
            'sentMessage' : '',
        }

        this.onHightLight = this.onHightLight.bind(this);
        this.onClickCell = this.onClickCell.bind(this);
        this.onMouseLeaveTable = this.onMouseLeaveTable.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.onFilterSearch = this.onFilterSearch.bind(this);
        this.onToggleBoolean = this.onToggleBoolean.bind(this);
        this.checkDisable = this.checkDisable.bind(this);
        this.onSendMessage = this.onSendMessage.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        // this.onMouseMove = this.onMouseMove.bind(this);
        let config = {
            'headers': {
                'Authorization': ('JWT ' + getCookie('fb_sever_token')),
                'crossDomain': true
            }
        }

        let _this = this;

        axios.get(`${hostname}event/stat?id=${this.props.eventId}`, config).then((data) => {
            console.log('get stat');
            console.log(data.data);
            let joined = data.data.join_data;
            var allData = [];
            for(var i = 0; i < joined.length; i++){
                let row = [false, false, "", joined[i].firstNameTH, joined[i].lastNameTH, joined[i].nick_name, "", joined[i].phone, "", joined[i].firstName+" "joined[i].lastName, "", joined[i].disease];
                allData.push(row);
            }
            _this.setState({
                ..._this.state,
                'tableData': allData;
            })
        });

        axios.get(`${hostname}event?id=${this.props.eventId}`, { headers: { 'crossDomain': true }}).then((data) => {
            _this.setState({
                ..._this.state,
                'formId': data.data.forms[testFormId][Object.keys(data.data.forms[testFormId])[0]],
                'formTitle': Object.keys(data.data.forms[testFormId])[0],
                'eventName': data.data.title
            })

            return data.data.forms[testFormId][Object.keys(data.data.forms[testFormId])[0]];
        }).then((formId) => {
            axios.get(`${hostname}form?id=${formId}&opt=responses`, config).then((data) => {
                _this.setState({
                    ..._this.state,
                    'formData': data.data.form,
                    'responses': data.data.form.responses
                });
            })
        });

    }

    onToggleBoolean(row, col, forcedValue) {
        if(row === null || col === null) return;
        if(fields[col-1].toUpperCase() === "APPROVED") {
            if(typeof(this.state.tableData[row-1][col-1]) === "boolean") {
                let new_tableData = [...this.state.tableData];
                new_tableData[row-1][col-1] = (typeof(forcedValue) === "boolean") ? forcedValue : !new_tableData[row-1][col-1];
                if(!new_tableData[row-1][col-1]) {
                    new_tableData[row-1][(fields.map((key) => key.toUpperCase())).indexOf("CHECK IN")] = false;
                }
                this.setState({
                    ...this.state,
                    'tableData': new_tableData
                })
                //make ajax call
            }
        }
        else if(fields[col-1].toUpperCase() === "CHECK IN") {
            const isApproved = this.state.tableData[row-1][(fields.map((key) => key.toUpperCase())).indexOf("APPROVED")];

            if(typeof(this.state.tableData[row-1][col-1]) === "boolean" && isApproved) {
                let new_tableData = [...this.state.tableData];
                new_tableData[row-1][col-1] = (typeof(forcedValue) === "boolean") ? forcedValue : !new_tableData[row-1][col-1];
                this.setState({
                    ...this.state,
                    'tableData': new_tableData
                })
                //make ajax call
            } else {
                let new_tableData = [...this.state.tableData];
                new_tableData[row-1][col-1] = false;
                this.setState({
                    ...this.state,
                    'tableData': new_tableData
                });
            }
        }
    }

    onClickCell(row, col) {
        //console.log("click");
        if(row > 0) {
            const selected_cell = this.refs["main-table"].children[1].children[row-1].children[col];
            if(this.state.selectedCell.row === row && this.state.selectedCell.col === col) {
                const optionsWidth = 120;
                const optionHeight = 100
                const options = this.refs["options"];

                options.style.height = `${optionHeight}px`;
                options.style.width = `${optionsWidth}px`;

                const nextOptionState = !this.state.optionActive;

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

                this.setState({
                    ...this.state,
                    'optionActive': nextOptionState
                });
            } else {
                this.setState({
                    ...this.state,
                    'selectedCell': {
                        'row': row,
                        'col': col
                    },
                    'optionActive': false
                });

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
    }

    compnentWillUnMount() {
        document.removeEventListener('keydown', this.onKeyPress);
    }

    componentWillMount() {
        document.title = "Event Hub | Table";
    }

    onKeyPress(e) {
        e = e || window.event;
        if(e.keyCode === 27) {
            this.setState({
                ...this.state,
                'selectedCell': {
                    'row': null,
                    'col': null
                }
            });

            this.refs["sr"].style.display = "none";
            this.refs["sc"].style.display = "none";
            this.refs["options"].style.display = "none";
        }
    }

    filter(arrayOfFields, key) {
        let isFound = false;
        for(let i = 0; i < arrayOfFields.length && !isFound; i++) {
            if(arrayOfFields[i].toString().toUpperCase().includes(key.toUpperCase())) { isFound = true; }
        }
        return isFound;
    }

    onFilterSearch() {
        const keyword = this.refs.filterSearch.value;

        this.setState({
            ...this.state,
            'filterKeyword': keyword,
            'filteredDataFlags': this.state.tableData.map((item) => this.filter(item, keyword))
        });
    }

    // componentDidUpdate() {
    //     console.log(this.state);
    // }

    checkDisable() {
        return (this.state.selectedCell.row === null && this.state.selectedCell.col === null)
    }

    onSendMessage() {
        this.setState({
          ...this.state,
          'sentMessage': this.refs.sent_message.value,
        });
    }

    sendMessage() {
      let config = {
          'headers': {
              'Authorization': ('JWT ' + getCookie('fb_sever_token')),
              'crossDomain': true
          }
      }
      let data = {
          description: this.state.sentMessage,
      }
      axios.post(`${hostname}event/join/message?id=${this.props.eventId}`, data, config).then((data) => {
          console.log('post ja');
      });
    }


    render() {
        let csvData = [["No.", ...fields]];
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
                                    fields.map((field, index) => {
                                        return <div key={index+1} className="th" onMouseEnter={() => {this.onHightLight(0, index+1)}}>{field}</div>
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
                                            <div className="tr" key={count-1}>
                                                <div className="td" onMouseEnter={() => {this.onHightLight(c, 0)}} onClick={() => {this.onClickCell(c, 0)}}>{c}</div>
                                                {
                                                    person.map((sample, col) => {
                                                        let inner = (typeof(sample) === "boolean") ? <i className={`fa fa-check ${(sample) ? '' : 'nope'}`} /> : sample
                                                        return (
                                                        <div key={`col-${col}`} className="td" onMouseEnter={() => {this.onHightLight(c, col+1)}} onClick={() => {
                                                                new Promise((res, rej) => res(true)).then(() => {this.onClickCell(c, col+1);}).then(() => {if(col === 1) this.onToggleBoolean(c, col+1);})
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
                                            this.onToggleBoolean(this.state.selectedCell.row, 1, true);
                                        }}>Approve</li>
                                    <li onClick={() => {
                                            this.onToggleBoolean(this.state.selectedCell.row, 1, false);
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
                            <button className="Btn-green" onClick={() => {
                                    this.onToggleBoolean(this.state.selectedCell.row, 1, true);
                                }}>APPROVE</button>
                            <button className="Btn-red" onClick={() => {
                                    this.onToggleBoolean(this.state.selectedCell.row, 1, false);
                                }}>REJECT</button>
                        </div>
                        <div className="Input-group">
                            <input type="text" ref="sent_message" value={this.state.sentMessage} onChange={() => this.onSendMessage()} />
                            <button disabled={this.checkDisable()} className={`${(this.checkDisable()) ? 'cursor-disabled' : ''}`} onClick={() => this.sendMessage()}>SEND MESSAGE</button>
                        </div>
                        <button><CSVLink filename={`Export-[${this.state.eventName}]-(${new Date().toString().slice(0, 10)}).csv`} data={csvData}>EXPORT (CSV)</CSVLink></button>
                    </div>
                </section>
            </div>
        );
    }
}

tablePage.defaultProps = {
    'eventId': '594bf476e374d100140f04ec'
}


export default normalPage(pages(tablePage, true));
