import React, { Component } from 'react';

import TopNavBar from '../container/topNavBar';
import SideMenu from '../components/sideMenu';

export default function(ComposedComponent) {
    class NormalPage extends Component {
        render() {
            return (
                <div>
                    <SideMenu />
                    <div className="content-move-inactive">
                        <ComposedComponent {...this.props} />
                        <TopNavBar />
                    </div>
                </div>
            );
        }
    }
    return NormalPage;
}
