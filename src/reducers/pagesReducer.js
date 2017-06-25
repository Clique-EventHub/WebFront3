import * as types from '../actions/types';

const initialState = {
    is_blur: false,
    pop_up_item: null,
    is_item_shown: false,
    forced_fixed_body: false,
    FB: null
}

export default ( state = initialState, action ) => {
    switch(action.type) {
        case types.BLUR_BG:
        case types.UNBLUR_BG:
            return({
                ...state,
                is_blur: action.payload
            });
        case types.TOGGLE_BLUR_BG:
            return ({
                ...state,
                is_blur: !(state.is_blur)
            });
        case types.SET_ITEM:
        case types.RESET_ITEM:
            return ({
                ...state,
                pop_up_item: action.payload
            });
        case types.DISPLAY_ITEM:
        case types.HIDE_ITEM:
            return ({
                ...state,
                is_blur: (action.type === types.DISPLAY_ITEM),
                is_item_shown: (action.type === types.DISPLAY_ITEM),
                pop_up_item: (action.payload != null) ? action.payload : state.pop_up_item
            });
        case types.TOGGLE_ITEM:
            return ({
                ...state,
                is_blur: !state.is_blur,
                is_item_shown: !state.is_item_shown
            });
        case types.FORCED_FIX_BG:
        case types.CANCEL_FIX_BG:
            return ({
                ...state,
                forced_fixed_body: action.payload
            });
        case types.SET_FB_VARIABLE:
            return ({
                ...state,
                FB : action.payload
            })
        default:
            return state;
    }
}
