import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';
import { hostname } from '../../actions/index';
import { getUserIdInfo, compareArray } from '../../actions/common'
import Image from '../../components/Image';
import styled from 'styled-components';

const AddListStyle = styled.div`
    -webkit-box-flex: 1;
    -ms-flex: 1 1 100%;
    flex: 1 1 100%;
    max-width: 33%;
    width: 100%;
    min-width: 250px;
    box-sizing: border-box;
    padding: 0px 10px;
    display: inline-block;

    button {
        border-color: #ccc !important;
        color: #999 !important;
        background-color: #fff !important;
        border: 1.8px solid;
        padding: 10px 20px;
        border-radius: 5px;
        width: 100%;
    }

    button.invisible {
        background-color: transparent !important;
        border: none;
        outline: none;
        cursor: pointer;
    }

    .ChildBox {
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
        border: 1px solid #CCC;
        border-radius: 5px;
        padding: 15px;
        position: relative;
        padding-top: 40px;

        &>* {
            display: block;
        }

        input {
            margin-bottom: 7px;
            outline: none;
            border: 1px solid rgba(0, 0, 0, 0.05);
            font-size: 1rem;
        }

        .right {
            position: absolute;
            top: 10px;
            right: 10px;
            width: auto !important;

            img {
                height: 1.5em;
                width: 1.5em;
            }
    }

    ul {
        list-style-type: none !important;
        padding: 0px;

        li {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            margin: 3px 0px;

            input {
                width: 100%;
                font-size: 1.5rem;
                padding: 3px 5px;
                height: 1.2em;
                -webkit-box-flex: 1;
                -ms-flex: 1 1 100%;
                flex: 1 1 100%;
            }
            
            button {
                display: block;
            }
        }
    }
`;

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

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmoint() {
        this._isMounted = false;
    }

    getUserInfoFromMap(id) {
        if(typeof this.state.userMap[id] !== undefined) {
            return this.state.userMap[id]
        }
        return {};
    }

    onUpdateUserMap(id, index) {
        if(typeof this.state.userMap[id] === "undefined") {
            try {
                axios.get(`${hostname}findmg?user=${id}`).then(
                    (data) => data.data)
                    .then((data) => {
                        // console.log(data);
                        const new_map = { ...this.state.userMap };
                        new_map[_.get(data, 'user_info._id', undefined)] = data.user_info;
                        if (this._isMounted) {
                            this.setState((prevState) => {
                                return ({
                                    ...prevState,
                                    userMap: new_map
                                });
                            });
                        }
                    }).catch((error) => {
                        // console.log(error);
                    })

                if (!isNaN(parseFloat(id)) && isFinite(id)) {
                    axios.get(`${hostname}findreg?user=${id}`).then(
                        (data) => data.data
                    ).then((data) => {
                        // console.log(data);
                        const new_map = { ...this.state.userMap };
                        new_map[_.get(data, 'user_info._id', undefined)] = data.user_info;
                        const new_children = [...this.state.children];
                        new_children[index] = _.get(data, 'user_info._id', '');
                        if (this._isMounted) {
                            this.setState((prevState) => {
                                return ({
                                    ...this.prevState,
                                    userMap: new_map,
                                    children: new_children
                                });
                            }, () => {
                                if (typeof (this.props.onUpdate) === "function") {
                                    this.props.onUpdate(this.state.children);
                                }
                            });
                        }
                    }).catch((error) => {
                        // console.log(error);
                    })

                    axios.get(`${hostname}findfb?user=${id}`).then(
                        (data) => data.data
                    ).then((data) => {
                        // console.log(data);
                        const new_map = { ...this.state.userMap };
                        new_map[_.get(data, 'user_info._id', undefined)] = data.user_info;
                        const new_children = [...this.state.children];
                        new_children[index] = _.get(data, 'user_info._id', '');
                        if (this._isMounted) {
                            this.setState((prevState) => {
                                return ({
                                    ...this.prevState,
                                    userMap: new_map,
                                    children: new_children
                                });
                            }, () => {
                                if (typeof (this.props.onUpdate) === "function") {
                                    this.props.onUpdate(this.state.children);
                                }
                            });
                        }
                    }).catch((error) => {
                        // console.log(error);
                    })
                } else {
                    getUserIdInfo(id).then((data) => {
                        const new_map = { ...this.state.userMap };
                        new_map[_.get(data, '_id', undefined)] = data;
                        const new_children = [...this.state.children];
                        new_children[index] = _.get(data, '_id', '');
                        if (this._isMounted) {
                            this.setState((prevState) => {
                                return ({
                                    ...this.prevState,
                                    userMap: new_map,
                                    children: new_children
                                });
                            }, () => {
                                if (typeof (this.props.onUpdate) === "function") {
                                    this.props.onUpdate(this.state.children);
                                }
                            });
                        }
                    }).catch((error) => {
                        // console.log(error);
                    })
                }
                
            } catch(e) {
                console.log(e);
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
                if (this._isMounted) {
                    this.setState((prevState) => {
                        return ({
                            ...prevState,
                            'children': new_children_1
                        });
                    }, () => {
                        if (typeof (this.props.onUpdate) === "function") {
                            this.props.onUpdate(this.state.children);
                        }
                    });
                }
                break;
            case 2:
                const new_children_3 = [...this.state.children].concat([""]);
                if(typeof(this.props.onUpdate) === "function") {
                    this.props.onUpdate(new_children_3);
                }
                if (this._isMounted) {
                    this.setState((prevState) => {
                        return ({
                            ...prevState,
                            'children': new_children_3
                        });
                    }, () => {
                        if (typeof (this.props.onUpdate) === "function") {
                            this.props.onUpdate(this.state.children);
                        }
                    });
                }
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
                if (this._isMounted) {
                    this.setState((prevState) => {
                        return ({
                            ...prevState,
                            'children': new_children_2
                        });
                    }, () => {
                        if (typeof (this.props.onUpdate) === "function") {
                            this.props.onUpdate(this.state.children);
                        }
                    });
                }
        }
    }

    componentWillReceiveProps(nextProps) {
        if(!this.state.isLoad && nextProps.isLoad) {
            if(this._isMounted) {
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
                    if (typeof (this.props.onUpdate) === "function") {
                        this.props.onUpdate(this.state.children);
                    }
                })
            }
        }

        if (!compareArray(nextProps.children, this.props.children)) {
            if(this._isMounted) {
                this.setState((prevState) => {
                    return ({
                        ...prevState,
                        children: nextProps.children
                    });
                }, () => {
                    if (typeof (this.props.onUpdate) === "function") {
                        this.props.onUpdate(this.state.children);
                    }
                })
            }
            nextProps.children.forEach((mongoId, index) => {
                this.onUpdateUserMap(mongoId, index)
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

        if (this._isMounted) {
            this.setState((prevState) => {
                return ({
                    ...prevState,
                    'children': new_children
                });
            });
        }

        if(typeof(this.props.onUpdate) === "function") {
            this.props.onUpdate(new_children);
        }
    }

    onRemove(index) {
        const new_children = this.state.children.slice(0, index).concat(this.state.children.slice(index+1, this.state.children.length));
        if (this._isMounted) {
            this.setState((prevState) => {
                return ({
                    ...prevState,
                    'children': new_children
                });
            });
        }

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
            <AddListStyle className={`AddList ${this.props.className ? this.props.className : ''}`} style={
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
                            'flexWrap': 'wrap',
                            'listStyleType': 'none',
                            'paddingLeft': '0'
                        } : {
                            'listStyleType': 'none',
                            'paddingLeft': '0'
                        }
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
                                                'justifyContent': 'left',
                                                'alignItems': 'center'
                                            }}>
                                            <Image
                                                src={_.get(userInfoArray[index], 'picture_200px', _.get(userInfoArray[index], 'picture', ''))}
                                                imgOption={{
                                                    'style': {
                                                        'height': '50px',
                                                        'width': '50px',
                                                        'borderRadius': '50%',
                                                        'marginRight': '10px'
                                                    }
                                                }}
                                                rejectOption={{
                                                    'style': {
                                                        'height': '50px',
                                                        'width': '50px',
                                                        'borderRadius': '50%',
                                                        'marginRight': '10px'
                                                    }
                                                }}
                                            />
                                            <div>
                                                <span>{_.get(userInfoArray[index], 'firstName', '') + " " + _.get(userInfoArray[index], 'lastName', '')}</span>
                                                <div>{_.get(userInfoArray[index], 'regId', '[REG ID]')}</div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            )
                        })
                    }
                </ul>
            </AddListStyle>
        );
    }
}

AddList.defaultProps = {
    isLoad: true
}

export default AddList;
