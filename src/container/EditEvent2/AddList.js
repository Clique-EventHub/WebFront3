import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';
import { hostname } from '../../actions/index';

class AddList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            'children': (this.props.children && this.props.children.constructor === Array) ? this.props.children : [],
            'mode': this.props.mode ? this.props.mode : 0,
            'isLoad': false,
            'userMap': {}
        }
        this.onClickAdd = this.onClickAdd.bind(this);
        this.onEdit = this.onEdit.bind(this);
        this.onRemove = this.onRemove.bind(this);
        this.getUserInfoFromMap = this.getUserInfoFromMap.bind(this);

        if(this.props.isLoad) {
            setTimeout(() => {
                this.setState((prevState, props) => {
                    return {
                        ...prevState,
                        isLoad: true,
                        children: (props.children && props.children.constructor === Array) ? props.children : []
                    }
                })
            })
        }

        this.onUpdateUserMapWrapper = _.debounce((id, index) => {
            this.onUpdateUserMap(id, index);
        }, 500);
    }

    getUserInfoFromMap(id) {
        if(typeof this.state.userMap[id] !== undefined) {
            return this.state.userMap[id]
        }
        return {};
    }

    onUpdateUserMap(id, index) {
        if(typeof this.state.userMap[id] === "undefined") {
            axios.get(`${hostname}findmg?user=${id}`).then(
                (data) => data.data)
                .then((data) => {
                    // console.log(data);
                    const new_map = {...this.state.userMap};
                    new_map[_.get(data, 'user_info._id', undefined)] = data.user_info;
                    this.setState({
                        ...this.state,
                        userMap: new_map
                    });
                }).catch((error) => {
                    // console.log(error);
            })

            if(!isNaN(parseFloat(id)) && isFinite(id)) {
                axios.get(`${hostname}findfb?user=${id}`).then(
                    (data) => data.data
                ).then((data) => {
                        // console.log(data);
                        const new_map = {...this.state.userMap};
                        new_map[_.get(data, 'user_info._id', undefined)] = data.user_info;
                        const new_children = [...this.state.children];
                        new_children[index] = _.get(data, 'user_info._id', '');
                        this.setState({
                            ...this.state,
                            userMap: new_map,
                            children: new_children
                        });
                    }).catch((error) => {
                        // console.log(error);
                })

                axios.get(`${hostname}findreg?user=${id}`).then(
                    data => data.data
                ).then((data) => {
                    const new_map = {...this.state.userMap};
                    new_map[_.get(data, 'user_info._id', undefined)] = data.user_info;
                    const new_children = [...this.state.children];
                    new_children[index] = _.get(data, 'user_info._id', '');
                    this.setState({
                        ...this.state,
                        userMap: new_map,
                        children: new_children
                    });
                }).catch((error) => {
                    // console.log(error);
                })
            }
        }
    }

    onClickAdd() {
        switch (this.state.mode) {
            case 0:
                const new_children_1 = [...this.state.children].concat([""]);
                if(typeof(this.props.onUpdate) === "function") {
                    this.props.onUpdate(new_children_1);
                }
                this.setState({
                    ...this.state,
                    'children': new_children_1
                })
                break;
            case 2:
                const new_children_3 = [...this.state.children].concat([""]);
                if(typeof(this.props.onUpdate) === "function") {
                    this.props.onUpdate(new_children_3);
                }
                this.setState({
                    ...this.state,
                    'children': new_children_3
                })
                break;
            default:
                const new_children_2 = [...this.state.children].concat([{
                    "title": "",
                    "content": [],
                    "note": ""
                }]);
                if(typeof(this.props.onUpdate) === "function") {
                    this.props.onUpdate(new_children_2);
                }
                this.setState({
                    ...this.state,
                    'children': new_children_2
                })
        }
    }

    componentWillReceiveProps(nextProps) {
        if(!this.state.isLoad && nextProps.isLoad) {
            this.setState((prevState, props) => {
                if(this.state.mode !== 2) {
                    return {
                        ...prevState,
                        isLoad: true,
                        children: (nextProps.children && nextProps.children.constructor === Array) ? nextProps.children : []
                    }
                } else {
                    const reliableChild = (nextProps.children && nextProps.children.constructor === Array) ? nextProps.children : [];
                    return {
                        ...prevState,
                        isLoad: true,
                        children: reliableChild
                    }
                }
            }, () => {
                if(this.props.mode === 2) {
                    this.state.children.forEach((id, index) => this.onUpdateUserMap(id, index));
                }
            })
        }
    }

    onEdit(index) {
        let new_children = [...this.state.children];

        switch (this.state.mode) {
            case 0:
                new_children[index] = this.refs[`input-${index}`].value;
                break;
            case 2:
                const id = this.refs[`input-${index}`].value;
                new_children[index] = id;

                this.onUpdateUserMapWrapper(id, index);

                break;
                // axios.get()

            default:
                new_children[index] = {
                    "title": this.refs[`child-${index}`].children[1].value,
                    "content": this.refs[`child-${index}`].children[2].value,
                    "note": (this.props.placeholder && this.props.placeholder.constructor === Array && this.props.placeholder.length === 3) ? this.refs[`child-${index}`].children[3].value : null
                }
        }

        this.setState({
            ...this.state,
            'children': new_children
        })

        if(typeof(this.props.onUpdate) === "function") {
            this.props.onUpdate(new_children);
        }
    }

    onRemove(index) {
        const new_children = this.state.children.slice(0, index).concat(this.state.children.slice(index+1, this.state.children.length));
        this.setState({
            ...this.state,
            'children': new_children
        })

        if(typeof(this.props.onUpdate) === "function") {
            this.props.onUpdate(new_children);
        }
    }

    render() {
        let userInfoArray = []
        if(this.props.mode === 2) {
            userInfoArray = this.state.children.map((id) => this.getUserInfoFromMap(id))
        }
        return (
            <div className={`AddList ${this.props.className ? this.props.className : ''}`} style={
                    (this.state.mode === 2) ? {
                        'maxWidth': '100%'
                    } : {}
                }>
                <div data-role="bottom-button">
                    <button onClick={this.onClickAdd}>{this.props.text ? this.props.text : "Add"}</button>
                </div>
                <ul data-role="top-list" style={
                        (this.state.mode === 2) ? {
                            'display': 'flex',
                            'flexWrap': 'wrap'
                        } : {}
                    }>
                    {
                        this.state.children.map((info, index) => {
                            return (this.state.mode === 0) ? (
                                <li key={index}>
                                    <input value={info} onChange={() => {this.onEdit(index);}} ref={`input-${index}`} placeholder={this.props.placeholder ? this.props.placeholder : ''} />
                                    <button className="invisible square-round" onClick={() => {this.onRemove(index)}}>
                                        <img src="../../resource/images/X.svg" />
                                    </button>
                                </li>
                            ) : (this.state.mode === 1) ? (
                                <li key={index} ref={`child-${index}`} className="ChildBox">
                                    <button className="invisible square-round right" onClick={() => {this.onRemove(index)}}>
                                        <img src="../../resource/images/X.svg" />
                                    </button>
                                    <input value={info.title} onChange={() => {this.onEdit(index);}} placeholder={(this.props.placeholder && this.props.placeholder.constructor === Array) ? this.props.placeholder[0] : "Title"} />
                                    <input value={info.content} onChange={() => {this.onEdit(index);}} placeholder={(this.props.placeholder && this.props.placeholder.constructor === Array) ? this.props.placeholder[1] : "Content"} />
                                    {
                                        (this.props.placeholder && this.props.placeholder.constructor === Array && this.props.placeholder.length === 3) ? (
                                            <input value={info.note} onChange={() => {this.onEdit(index);}} placeholder={(this.props.placeholder && this.props.placeholder.constructor === Array) ? this.props.placeholder[2] : "Note"} />
                                        ) : (null)
                                    }
                                </li>
                            ) : (
                                <li key={index} ref={`child-${index}`} className="ChildBox" style={{
                                        'marginLeft': '5px',
                                        'marginRight': '5px'
                                    }}>
                                    <button className="invisible square-round right" onClick={() => {this.onRemove(index)}}>
                                        <img src="../../resource/images/X.svg" />
                                    </button>
                                    {
                                        (_.get(userInfoArray[index], '_id', '').length === 0) ? (
                                            <input
                                                ref={`input-${index}`}
                                                value={info}
                                                onChange={() => {
                                                    this.onEdit(index);
                                                }}
                                                placeholder={(this.props.placeholder && this.props.placeholder.constructor === Array) ? this.props.placeholder[0] : "STUDENT ID"}
                                            />
                                        ) : null
                                    }
                                    <div>
                                        <div style={{
                                                'display': 'flex',
                                                'justifyContent': 'center',
                                                'alignItems': 'center'
                                            }}>
                                            <img
                                                src={_.get(userInfoArray[index], 'picture_200px', _.get(userInfoArray[index], 'picture', ''))}
                                                style={{
                                                    'height': '50px',
                                                    'width': '50px',
                                                    'borderRadius': '50%',
                                                    'marginRight': '10px'
                                                }}
                                                />
                                            <div>
                                                <span>{_.get(userInfoArray[index], 'firstName', '') + " " + _.get(userInfoArray[index], 'lastName', '')}</span>
                                                <div>[REG ID]</div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        );
    }
}

AddList.defaultProps = {
    isLoad: true
}

export default AddList;
