import React, { Component } from 'react';
import styled from 'styled-components';

const StyledMsg = styled.div`
    z-index: 2000;
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 65px;
    left: 0;
    visibility: hidden;
    opacity: 0;
    transition: all 0.2s;

    &.display {
        visibility: visible;
        opacity: 1;
    }

    .front {
        z-index: 2001 !important;
        position: relative;
    }
    .bg {
        z-index: 2000;
        background-color: rgba(0,0,0,0.1);
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0px;
    }

    .Message-Btn-Container {
        .bottom {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 20px;

            button {
                position: static;
                margin: 0px 5px;
                left: initial;
                transform: initial;
            }
        }
    }
`;

class MsgConfirm extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <StyledMsg className={this.props.isShow ? "display" : ""}>
                <div className="front">
                    <div className="modal-container">
                        <article className="event-detail-fix basic-card-no-glow">
                            <button className="invisible square-round" role="event-exit" onClick={() => this.props.onExit(false)}>
                                <img src="../../resource/images/X.svg" />
                            </button>
                            <div className="Message-Btn-Container">
                                <div className="Message-Container">
                                    <div className={`Message red`}>
                                        {this.props.children}
                                    </div>
                                </div>
                                <div className="bottom">
                                    <button onClick={() => this.props.onExit(false)}>
                                        No
                                    </button>
                                    <button onClick={() => {
                                        Promise.resolve().then(() => {
                                            if(typeof this.props.onConfirm === "function")
                                                return this.props.onConfirm();
                                            return;
                                        }).then(() => {
                                            this.props.onExit(true);
                                        })
                                    }}>
                                        Yes
                                    </button>
                                </div>
                            </div>
                        </article>
                        <div className="background-overlay" />
                    </div>
                </div>
                <div className="bg" />
            </StyledMsg>
        );
    }
}

export default MsgConfirm;