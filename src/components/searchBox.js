import React, { Component } from 'react';

class searchBox extends Component {

    // constructor(props) {
    //     super(props);
    // }

    render() {
        return (
            <div className="search-box-container" aria-hidden="true">
                <div className="background-overlay" aria-hidden="true" />
                <section className="search-box">
                    <form onSubmit={this.props.onSubmit}>
                        <input type="text" placeholder="Search" ref="second" onChange={() => { this.props.onUpdateSearch("second", {value: this.refs.second.value}); }} value={this.props.searchTerm}></input>
                        <button className="outline square-round">
                            <i className="fa fa-search" aria-hidden="true"></i>
                        </button>
                    </form>
                </section>
            </div>
        );
    }
}

export default searchBox;
