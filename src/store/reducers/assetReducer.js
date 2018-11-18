import * as actionTypes from '../actions/actionTypes';
import {updateObject} from "../../shared/utility";


const initialState = {
    message: ""
}


const updateMenu = (state = initialState, action) => {
    return updateObject(state, {
        message: action.message
    });
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.UPDATE_MENU:
            return updateMenu(state, action);

        default:
            return state;
    }
};

export default reducer;