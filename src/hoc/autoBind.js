import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actions from '../actions';
import { filterKeyOut, mergeObjectWithKeys } from '../actions/common';

export default function(ComposedComponent, isBindWithRequests, actionsAdded, stateAdded) {

    class binding extends Component {

        static contextTypes = {
            router: PropTypes.object
        }

        render() {
            return (
                <ComposedComponent {...this.props} context={this.context}>
                    {this.props.children}
                </ComposedComponent>
            );
        }

    };

    function mapStateToProps(state) {
        if(isBindWithRequests) {
            return {...state};
        }
        if(typeof(stateAdded) !== "undefined" && stateAdded.length > 0) {
            let rObj = {
                pages: state.pages
            }
            stateAdded.map((item) => {
                rObj[item] = state[item];
                return null;
            });
            return (rObj);
        }
        return {
            pages: state.pages
        };
    }

    function mapDispatchToProps(dispatch) {
        if(isBindWithRequests) {
            return bindActionCreators({...actions}, dispatch);
        }
        if(typeof(actionsAdded) !== "undefined" && actionsAdded.length > 0) {
            return bindActionCreators(mergeObjectWithKeys(filterKeyOut(actions, actions.requestActionList), actions, actionsAdded), dispatch);
        }
        return bindActionCreators(filterKeyOut(actions, actions.requestActionList), dispatch);
    }

    return connect(mapStateToProps, mapDispatchToProps)(binding);
}
