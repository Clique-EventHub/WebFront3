import React, { Component } from 'react';

export default function(ComposedComponent) {
    return (class A extends Component {
        render() {
            // console.log(ComposedComponent);
            return (
                <ComposedComponent {...this.props} />
            );
        }
    });

}
