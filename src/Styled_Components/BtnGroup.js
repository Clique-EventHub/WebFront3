import styled from 'styled-components';

const BtnGroup = styled.div`
    display: flex;
    // margin: 0px 5px 20px 5px;
    .Btn-red:hover {
        background-color: #FC4D11 !important;
        border-color: #FC4D11 !important;
    }
    .Btn-red:active {
        background-color: #FC4D11 !important;
        border-color: #FC4D11 !important;
        filter: brightness(0.9);
    }
    .Btn-green:hover {
        background-color: #52C00E !important;
        border-color: #52C00E !important;
    }
    .Btn-green:active {
        background-color: #52C00E !important;
        border-color: #52C00E !important;
        filter: brightness(0.9);
    }

    button {
        margin: 0px !important;
        border-radius: 0px !important;
        width: 100px !important;
        font-size: 0.7em !important;
        background-color: #F1F1F1 !important;
        color: #878787 !important;
        border: 1px solid #E7E7E7 !important;
        height: calc(1em + 30px) !important;
    }

    button:hover {
        background-color: #5080FC !important;
        border-color: #5080FC !important;
        color: #FFF !important;
    }

    button:active {
        background-color: #376AFC !important;
        border-color: #376AFC !important;
        color: #FFF !important;
    }

    button:nth-child(1) {
        border-radius: 10px 0px 0px 10px !important;
        border-right: none !important;
    }
    button:last-child {
        border-radius: 0px 10px 10px 0px !important;
        border-left: none !important;
    }
`;

export default BtnGroup;