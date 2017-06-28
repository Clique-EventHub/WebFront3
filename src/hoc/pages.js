import './style/pages.css';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import $ from 'jquery';

import * as actions from '../actions';
import { filterKeyOut, mergeObjectWithKeys } from '../actions/common';

export default function(ComposedComponent, isBindWithRequests, actionsAdded, stateAdded) {

    class page extends Component {

        static contextTypes = {
            router: PropTypes.object
        }

        componentDidMount() {
            if($('#modal').css('display') === "block") {
                $('#modal').css('display', 'none');
            }
            //this.props.getChannel("5881ce872d9ae35708911f04");
            //this.props.getAllChannel();
        }

        componentWillMount() {
            if(this.props.pages.is_blur) {
                this.props.unblur_bg();
            }
            if(this.props.pages.is_item_shown) {
                this.props.hide_pop_item();
            }
        }

        componentWillReceiveProps(nextProps) {
            if(nextProps.pages.is_item_shown) {
                $("body").addClass("modal-open");
                if($('#modal').css('display') === "none") {
                    $('#modal').fadeToggle(200);
                }
            } else {
                $("body").removeClass("modal-open")
                if($('#modal').css('display') === "block") {
                    $('#modal').fadeToggle(200);
                }
            }
        }

        render() {

            let blur_class = (this.props.pages.is_blur) ? "blur shift" : "no-blur shift";
            let pop_up_item = (this.props.pages.pop_up_item != null) ? this.props.pages.pop_up_item : (<div aria-hidden="true"></div>);

            return (
                <div>
                    <div className={blur_class} >
                        <ComposedComponent {...this.props} context={this.context}>
                            {this.props.children}
                        </ComposedComponent>
                    </div>
                    <div aria-hidden="true" id="modal">
                        {pop_up_item}
                    </div>
                </div>
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

    return connect(mapStateToProps, mapDispatchToProps)(page);
}
