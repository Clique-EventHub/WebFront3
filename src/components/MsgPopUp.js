import React, { Component } from 'react';

const MsgPopUp = (props) => {
    return (
        <div className="modal-container">
            <article className="event-detail-fix basic-card-no-glow">
                <button className="invisible square-round" role="event-exit" onClick={() => props.onExit(false)}>
                    <img src="../../resource/images/X.svg" />
                </button>
                <div className="Message-Btn-Container">
                    <div className="Message-Container">
                        <div className={`Message ${(props.colourStr) ? (props.colourStr) : ''}`}>
                            { props.children }
                        </div>
                    </div>
                    <button onClick={() => props.onExit(true)}>
                        Okay
                    </button>
                </div>
            </article>
            <div className="background-overlay"/>
        </div>
    );
}

export default MsgPopUp;
