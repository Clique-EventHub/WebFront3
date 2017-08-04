import React, { Component } from 'react';
import { hostname } from '../../actions/index';

function replaceIncorrectLink(str) {
    if(typeof(str) === "string") {
        if(str.indexOf("128.199.208.0/") === 0) str = str.replace("128.199.208.0/", hostname);
        else if(str.indexOf("cueventhub.com/") === 0) str = str.replace("cueventhub.com/", hostname)
        else if(str.indexOf("139.59.97.65:1111/") === 0) str = str.replace("139.59.97.65:1111/", hostname)
        return str;
    }
    return null;
}

class AddAdmin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            'isOpen': false,
            'selected': [],
            'filter': [],
            'keyword': '',
            'btnStyle': {
                    'marginLeft': '5px',
                    'height': '35px',
                    'border': '1.8px solid #CCC',
                    'borderRadius': '5px',
                    'fontSize': '1em',
                    'minWidth': '90px',
                    'whiteSpace': 'nowrap'
                }
        }
        this.filterName = this.filterName.bind(this);
        this.onToggle = this.onToggle.bind(this);
        this.toggleShowReset = this.toggleShowReset.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.user.info.friends_list.length !== this.props.user.info.friends_list.length) {
            this.setState({
                ...this.state,
                'selected': nextProps.user.info.friends_list.map(() => false),
                'filter': nextProps.user.info.friends_list.map(() => false)
            })
        }
    }

    toggleShowReset() {
        let tmp = true;
        for(let i = 0; i < this.state.filter.length && tmp; i++) {
            tmp = this.state.filter[i];
        }

        this.setState({
            ...this.state,
            'filter': this.props.user.info.friends_list.map(() => !tmp)
        })
    }

    filterName() {
        if(this.refs.me.value === '') {
            this.setState({
                ...this.state,
                'filter': this.props.user.info.friends_list.map(() => false),
                'keyword': ''
            })
        } else {
            this.setState({
                ...this.state,
                'filter': this.props.user.info.friends_list.map((item) => {
                    return (item.fb.name.split(" ")[0].toLowerCase().indexOf(this.refs.me.value.toLowerCase()) !== -1) || (item.fb.name.split(" ")[1].toLowerCase().indexOf(this.refs.me.value.toLowerCase()) !== -1)
                }),
                'keyword': this.refs.me.value
            })
        }
    }

    onToggle(index, defaultValue) {
        if(index < 0 || index >= this.state.selected.length) return;
        let new_selected = [...this.state.selected];
        new_selected[index] = (typeof(defaultValue) === "boolean") ? defaultValue : !new_selected[index];

        this.setState({
            ...this.state,
            'selected': new_selected
        })

        if(typeof(this.props.onSelected) === "function") {
            this.props.onSelected(this.props.user.info.friends_list.filter((item, index) => new_selected[index]));
        }
    }

    onMouseEnter() {
        const defaultStyle = {
                'marginLeft': '5px',
                'height': '35px',
                'border': '1.8px solid #CCC',
                'borderRadius': '5px',
                'fontSize': '1em',
                'minWidth': '90px',
                'whiteSpace': 'nowrap'
            };

        this.setState({
            ...this.state,
            btnStyle: {
                ...defaultStyle,
                'backgroundColor': '#4caf50'
            }
        })
    }

    onMouseLeave() {
        const defaultStyle = {
                'marginLeft': '5px',
                'height': '35px',
                'border': '1.8px solid #CCC',
                'borderRadius': '5px',
                'fontSize': '1em',
                'minWidth': '90px',
                'whiteSpace': 'nowrap'
            };
        this.setState({
            ...this.state,
            btnStyle: {
                ...defaultStyle
            }
        })
    }

    onMouseClick() {
        const defaultStyle = {
                'marginLeft': '5px',
                'height': '35px',
                'border': '1.8px solid #CCC',
                'borderRadius': '5px',
                'fontSize': '1em',
                'minWidth': '90px',
                'whiteSpace': 'nowrap'
            };
        this.setState({
            ...this.state,
            btnStyle: {
                ...defaultStyle,
                'backgroundColor': '#729afd'
            }
        })
    }

    render() {
        return (
            <div className="basic-card-no-glow" style={{'width': '100%', 'minWidth': '150px', 'maxWidth': '250px', 'padding': '30px', 'margin': 'auto'}}>
                <div style={{'display': 'flex', 'maxHeight': '50px'}}>
                    <input type="text" placeholder="search" value={this.state.keyword} onChange={this.filterName} ref="me" style={{
                            'border': '1.8px solid #ccc',
                            'borderRadius': '5px',
                            'height': '35px',
                            'fontSize': '1em',
                            'marginBottom': '5px',
                            'width': '100%',
                            'paddingLeft': '5px',
                            'boxSizing': 'border-box',
                            'flex': '1'
                        }}/>
                    <button onClick={this.toggleShowReset} style={this.state.btnStyle} onMouseOver={this.onMouseEnter.bind(this)} onMouseLeave={this.onMouseLeave.bind(this)} onMouseDown={this.onMouseClick.bind(this)} onMouseUp={this.onMouseEnter.bind(this)}>Show All</button>
                </div>
                <div style={{'padding': '5px', 'backgroundColor': '#F1F1F1', 'maxHeight': '200px', 'overflowY': 'scroll'}} >
                    {
                        (this.props.user.info.friends_list).map((item, index) => {
                            return ((this.state.filter[index]) ? (
                                <div key={index} onClick={() => {
                                        this.onToggle(index);
                                    }} style={(this.state.selected[index]) ? {'backgroundColor': 'lightgreen', 'display': 'flex', 'alignItems': 'center', 'border': '1px solid rgba(0,0,0,0.05)', 'padding': '10px 0px'} : {'display': 'flex', 'alignItems': 'center', 'border': '1px solid rgba(0,0,0,0.05)', 'padding': '10px 0px'}}>
                                    <img src={replaceIncorrectLink(item.fb.picture.data.url)} height="50px" width="50px" style={{'borderRadius': '50%', 'marginRight': '20px'}} />
                                    <span>{item.fb.name}</span>
                                </div>
                            ) : (null)
                        )
                    })
                }
                </div>
                <div style={{'textAlign': 'center'}}>
                    {
                        (this.props.user.info.friends_list).map((item, index) => {
                            return ((this.state.selected[index]) ? (
                                <img key={index} src={replaceIncorrectLink(item.fb.picture.data.url)} height="50px" width="50px" style={{'borderRadius': '50%', 'margin': '5px 5px 0px 0px'}} />
                            ) : (null)
                        )})
                    }
                </div>
            </div>
        );
    }
}

export default AddAdmin;
