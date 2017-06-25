import { FETCH_ALL_CHANNELS } from '../actions/types';

const initalState = {
    fetching: false,
    fetched: false,
    error: null,
    response: null,
}

export default ( state = initalState, action ) => {
    switch (action.type) {
        case `${FETCH_ALL_CHANNELS}_PENDING`:
            return {
                ...state,
                fetching: true,
                error: null,
            };


        case `${FETCH_ALL_CHANNELS}_FULFILLED`:
            return {
                ...state,
                fetching: false,
                fetched: true,
                error: null,
                response: action.payload.data
            };


        case `${FETCH_ALL_CHANNELS}_REJECTED`:
            return {
                ...state,
                fetching: false,
                error: action.payload
            };


        default:
            return state;
    }
}
