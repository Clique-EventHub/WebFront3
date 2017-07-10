import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actions from '../actions';
import { filterKeyOut, mergeObjectWithKeys } from '../actions/common';

export default function(ComposedComponent, option) {

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
        if(option && option.state && option.state.constructor === Array && option.state.length > 0) {
            let rObj = {
                pages: state.pages
            }
            option.state.map((item) => {
                rObj[item] = state[item];
                return null;
            });
            return (rObj);
        }
        return {...state};;
    }

    function mapDispatchToProps(dispatch) {
        if(option && option.action && option.action.constructor === Array && option.action.length > 0) {
            return bindActionCreators(mergeObjectWithKeys(filterKeyOut(actions, actions.requestActionList), actions, option.action), dispatch);
        }
        else if(option && option.actionNes) {
            return bindActionCreators(filterKeyOut(actions, actions.requestActionList), dispatch);
        }
        return bindActionCreators({...actions}, dispatch);
    }

    return connect(mapStateToProps, mapDispatchToProps)(binding);
}
