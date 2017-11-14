import React from 'react';

const searchBox = (props) => {
    return (
        <div className="search-box-container" aria-hidden="true">
            <div className="background-overlay" aria-hidden="true" />
            <section className="search-box">
                <form onSubmit={props.onSubmit}>
                    <input type="text" placeholder="Search" onChange={(e) => { props.onUpdateSearch("second", {value: e.target.value}); }} value={props.searchTerm}></input>
                    <button className="outline square-round">
                        <i className="fa fa-search" aria-hidden="true"></i>
                    </button>
                </form>
            </section>
        </div>
    );
}

export default searchBox;
