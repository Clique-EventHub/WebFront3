import React, { Component } from 'react';

class MsgPopUp extends Component {
    render() {
        return (
            <div className="modal-container">
                <article className="event-detail-fix basic-card-no-glow">
                    <button className="invisible square-round" role="event-exit" onClick={this.props.onExit}>
                        <img src="../../resource/images/X.svg" />
                    </button>
                    <div className="Message-Btn-Container">
                        <div className="Message-Container">
                            <div className={`Message ${(this.props.colourStr) ? (this.props.colourStr) : ''}`}>
                                { this.props.children }
                            </div>
                        </div>
                        <button onClick={this.props.onExit}>
                            Okay
                        </button>
                    </div>
                </article>
                <div className="background-overlay"/>
            </div>
        );
    }
}

export default MsgPopUp;
