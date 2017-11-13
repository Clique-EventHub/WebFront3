import React, { Component } from 'react';
import styled from 'styled-components';
import MsgPopUp from '../components/MsgPopUp';

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
`;

const MsgFeedBack = (props) => {
    return (
        <StyledMsg className={props.isShow ? "display" : ""}>
            <div className="front">
                <MsgPopUp
                    {...props}
                    colourStr={props.isError ? 'red' : 'green'}
                />
            </div>
            <div className="bg" />
        </StyledMsg>
    );
}

export default MsgFeedBack;