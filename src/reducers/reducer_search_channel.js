import { SEARCH_CHANNEL_KEYWORD } from '../actions/types';

const initalState = {
    fetching: false,
    fetched: false,
    error: null,
    response: null,
}

export default ( state = initalState, action ) => {
    switch (action.type) {
        case `${SEARCH_CHANNEL_KEYWORD}_PENDING`:
            return {
                ...state,
                fetching: true,
                error: null,
            };


        case `${SEARCH_CHANNEL_KEYWORD}_FULFILLED`:
            return {
                ...state,
                fetching: false,
                fetched: true,
                error: null,
                response: action.payload.data
            };


        case `${SEARCH_CHANNEL_KEYWORD}_REJECTED`:
            return {
                ...state,
                fetching: false,
                error: action.payload
            };


        default:
            return state;
    }
}
