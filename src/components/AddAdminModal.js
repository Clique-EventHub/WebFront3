import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import _ from 'lodash';
import AddList from '../container/EditEvent2/AddList';
import { getUserIdInfo, compareArray, promiseSerial, getCookie, getChannel, forceUpdateEvent, forceUpdateChannel } from '../actions/common';
import { hostname } from '../actions/index';
import axios from 'axios';

class AddAdminModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoad: true,
            admins: [],
            new_admins: []
        }

        this.onUpdateEvent = this.onUpdateEvent.bind(this);
        this.onSaveEvent = this.onSaveEvent.bind(this);
        this.onSaveChannel = this.onSaveChannel.bind(this);
        this.onExit = this.onExit.bind(this);
    }

    onUpdateEvent(eventIndex) {
        if (_.get(this.props, `Events[${eventIndex}].admins`)) {
            if(this._isMounted) {
                this.setState((prevState) => {
                    return ({
                        ...prevState,
                        admins: _.get(this.props, `Events[${eventIndex}].admins`, [])
                    });
                })
            }
        }
    }

    onUpdateChannel() {
        const cid = _.get(this.props, `channelId`);
        if(cid) {
            getChannel(cid, true).then((data) => {
                if (this._isMounted) {
                    this.setState((prevState) => {
                        return ({
                            ...prevState,
                            admins: _.get(data, `admins`, [])
                        });
                    })
                }
            })
        }
    }

    onUpdateNewAdmins(val) {
        if (compareArray(this.state.new_admins, val)) return null;
        if (this._isMounted) {
            this.setState((prevState) => {
                return ({
                    ...prevState,
                    new_admins: val
                });
            })
        }
    }

    onSaveChannel() {
        const cid = _.get(this.props, `channelId`);
        forceUpdateChannel(cid, true).then((dat) => {
            let oldSets = dat.admins;
            let newSets = this.state.new_admins;
            //Find who got delete
            let oldDelete = oldSets.filter(function (x) { return newSets.indexOf(x) < 0 })
            //Find who got added
            let newAdd = newSets.filter(function (x) { return oldSets.indexOf(x) < 0 })
            //Using mongoID to get regID then do the rest of operation

            let promiseDeletes = [];
            let promiseAdds = [];

            oldDelete.forEach((mongoID) => {
                promiseDeletes.push(getUserIdInfo(mongoID));
            })
            newAdd.forEach((mongoID) => {
                promiseAdds.push(getUserIdInfo(mongoID))
            })

            const config = {
                'headers': {
                    'Authorization': ('JWT ' + getCookie('fb_sever_token'))
                }
            }

            if (cid) {
                Promise.all([Promise.all(promiseDeletes).then((datas) => {
                    //Serialize Promises
                    promiseSerial(datas.map(item => _.get(item, 'regId', '')).map((regId) => {
                        return (() => {
                            axios.delete(`${hostname}admin/channel/delete?id=${cid}`, {
                                ...config,
                                data: {
                                    "user": String(regId)
                                }
                            })
                        });
                    })).then(() => {
                        alert("Delete Complete")
                    })
                }),
                Promise.all(promiseAdds).then((datas) => {
                    //Serialize Promises
                    promiseSerial(datas.map(item => _.get(item, 'regId', '')).map((regId) => {
                        return (() => {
                            axios.put(`${hostname}admin/channel/add?id=${cid}`, {
                                "user": String(regId)
                            }, config)
                        });
                    })).then(() => {
                        alert("Added Complete")
                    })
                })]).then(() => {
                    setTimeout(() => {
                        forceUpdateChannel(cid, true);
                    }, 500);
                }).catch((e) => {
                    setTimeout(() => {
                        forceUpdateChannel(cid, true);
                    }, 500);
                })
            }
        })
    }

    onSaveEvent(eventIndex) {
        const eid = _.get(this.props, `Events[${eventIndex}]._id`)
        forceUpdateEvent(eid, true).then((dat) => {
            let oldSets = dat.admins;
            let newSets = this.state.new_admins;
            //Find who got delete
            let oldDelete = oldSets.filter(function (x) { return newSets.indexOf(x) < 0 })
            //Find who got added
            let newAdd = newSets.filter(function (x) { return oldSets.indexOf(x) < 0 })
            //Using mongoID to get regID then do the rest of operation

            let promiseDeletes = [];
            let promiseAdds = [];

            oldDelete.forEach((mongoID) => {
                promiseDeletes.push(getUserIdInfo(mongoID));
            })
            newAdd.forEach((mongoID) => {
                promiseAdds.push(getUserIdInfo(mongoID))
            })

            const config = {
                'headers': {
                    'Authorization': ('JWT ' + getCookie('fb_sever_token'))
                }
            }

            if (eid) {
                Promise.all([
                    Promise.all(promiseDeletes).then((datas) => {
                        //Serialize Promises
                        promiseSerial(datas.map(item => _.get(item, 'regId', '')).map((regId) => {
                            return (() => {
                                axios.delete(`${hostname}admin/event/delete?id=${eid}`, {
                                    ...config,
                                    data: {
                                        "user": String(regId)
                                    }
                                })
                            });
                        })).then(() => {
                            alert("Delete Complete")
                        })
                    }),
                    Promise.all(promiseAdds).then((datas) => {
                        //Serialize Promises
                        promiseSerial(datas.map(item => _.get(item, 'regId', '')).map((regId) => {
                            return (() => {
                                axios.put(`${hostname}admin/event/add?id=${eid}`, {
                                    "user": String(regId)
                                }, config)
                            });
                        })).then(() => {
                            alert("Added Complete")
                        })
                    })
                ]).then(() => {
                    setTimeout(() => {
                        forceUpdateEvent(eid, true);
                    }, 500);
                }).catch((e) => {
                    setTimeout(() => {
                        forceUpdateEvent(eid, true);
                    }, 500);
                })

            }
        })
    }

    onExit() {
        this.props.onToggle();
    }

    componentDidMount() {
        this._isMounted = true;
        if (this.props.isEvent) this.onUpdateEvent(0);
        else this.onUpdateChannel();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isEvent) {
            if (!this.props.isEvent) {
                if (this._isMounted) {
                    this.setState((prevState) => {
                        return ({
                            ...prevState,
                            admins: []
                        });
                    })
                }

                if (_.get(nextProps, `Events[${0}].admins`)) {
                    _.get(nextProps, `Events[${0}].admins`).map((mongoId) => {
                        getUserIdInfo(mongoId).then((data) => {
                            if (this._isMounted) {
                                this.setState((prevState) => {
                                    let new_admins = Array.from(new Set(prevState.admins.concat(_.get(data, 'regId', ''))))
                                    return ({
                                        ...prevState,
                                        admins: new_admins
                                    });
                                })
                            }
                        })
                    })
                }
            }
        }
        else {
            const cid = _.get(nextProps, `channelId`);
            if (cid) {
                getChannel(cid, true).then((data) => {
                    if (this._isMounted) {
                        this.setState((prevState) => {
                            return ({
                                ...prevState,
                                admins: _.get(data, `admins`, [])
                            });
                        })
                    }
                })
            }
        }
    }

    onGetAdminInfo(mongoId) {
        getUserIdInfo(mongoId).then((data) => {
            if(this._isMounted) {
                this.setState((prevState) => {
                    return ({
                        ...prevState,
                        admins: prevState.admins.concat(data)
                    });
                })
            }
        })
    }

    render() {
        let content = (this.props.isEvent) ? (
            <div>
                <h2>Event Name</h2>
                <select ref={sel => this._sel = sel} onChange={(e) => { this.onUpdateEvent(e.target.value) }}>
                    {_.get(this.props, 'Events', []).map((text, index) => {
                        return (<option value={index} key={index}>{text.title}</option>)
                    })}
                </select>
                <div data-role="admin" className="fields">
                    <h3>ADD ADMIN</h3>
                    <AddList
                        text="ADD ADMIN"
                        mode={2}
                        placeholder={"STUDENT ID"}
                        onUpdate={(val) => this.onUpdateNewAdmins(val)}
                        isLoad={this.state.isLoad}
                        children={this.state.admins}
                    />
                </div>
                <hr />
                <button onClick={this.onExit}>Cancel</button>
                <button onClick={() => this.onSaveEvent(this._sel.value)}>Save</button>
            </div>
        ) : (
            <div>
                <h2>Channel Admin</h2>
                <div data-role="admin" className="fields">
                    <h3>ADD ADMIN</h3>
                    <AddList
                        text="ADD ADMIN"
                        mode={2}
                        placeholder={"STUDENT ID"}
                        onUpdate={(val) => this.onUpdateNewAdmins(val)}
                        isLoad={this.state.isLoad}
                        children={this.state.admins}
                    />
                </div>
                <hr />
                <button onClick={this.onExit}>Cancel</button>
                <button onClick={this.onSaveChannel}>Save</button>
            </div>
        );
        return (
            <div className="modal-container">
                <article className="edit-event basic-card-no-glow modal-main card-width">
                    <button className="card-exit invisible square-round" role="event-exit" onClick={this.onExit.bind(this)}>
                        <img src="../../resource/images/X.svg" />
                    </button>
                    {content}
                </article>
                <div className="background-overlay" />
            </div>
        );
    }
}

AddAdminModal.PropTypes = {
    'onToggle': PropTypes.func.isRequired,
    'isEvent': PropTypes.bool.isRequired,
    'Events': PropTypes.arrayOf(PropTypes.object),
    'channelId': PropTypes.string
}

export default AddAdminModal;