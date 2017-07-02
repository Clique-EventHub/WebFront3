import React, { Component } from 'react';

class ErrorPopUp extends Component {
    render() {
        return (
            <div className="modal-container">
                <article className="event-detail-fix basic-card-no-glow">
                    <button className="invisible square-round" role="event-exit" onClick={this.props.onExit}>
                        <img src="../../resource/images/X.svg" />
                    </button>
                    <div className="Warning-Container">
                        <div className="Error-Warning-Container">
                            <div className="Error-Warning">
                                <span>
                                    {this.props.errorMsg}<br />
                                    {this.props.errorDetail}
                                </span>
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

export default ErrorPopUp;
