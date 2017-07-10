import { GET_EVENT } from '../actions/types';

const initalState = {
    fetching: false,
    fetched: false,
    error: null,
    response: null,
}

export default ( state = initalState, action ) => {
    switch (action.type) {
        case `${GET_EVENT}_PENDING`:
            return {
                ...state,
                fetching: true,
                error: null,
            };


        case `${GET_EVENT}_FULFILLED`:
            return {
                ...state,
                fetching: false,
                fetched: true,
                error: null,
                response: action.payload.data
            };


        case `${GET_EVENT}_REJECTED`:
            return {
                ...state,
                fetching: false,
                error: action.payload
            };


        default:
            return state;
    }
}
