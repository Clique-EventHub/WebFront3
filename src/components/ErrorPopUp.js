import React from 'react';

const ErrorPopUp = (props) => {
    return (
        <div className="modal-container">
            <article className="event-detail-fix basic-card-no-glow">
                <button className="invisible square-round" role="event-exit" onClick={props.onExit}>
                    <img src="../../resource/images/X.svg" />
                </button>
                <div className="Warning-Container">
                    <div className="Error-Warning-Container">
                        <div className="Error-Warning">
                            <span>
                                {props.errorMsg}<br />
                                {props.errorDetail}
                            </span>
                        </div>
                    </div>
                    <button onClick={props.onExit}>
                        Okay
                    </button>
                </div>
            </article>
            <div className="background-overlay"/>
        </div>
    );
}

export default ErrorPopUp;
