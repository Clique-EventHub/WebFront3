import styled from 'styled-components';

const InputText = styled.input`
    background-color: transparent;
    border :  none;
    outline: none;
    border-radius: 5px;
    padding: 5px 5px;

    &:focus {
        box-shadow: 0px 0px 10px #5dbdf0;
    }

    &.large {
        font-size: 1.2em;
    }
`;

export default InputText;