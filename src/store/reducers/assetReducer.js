import * as actionTypes from '../actions/actionTypes';
import {updateObject} from "../../shared/utility";


const initialState = {
    isOwner: false,
    earnings: 0
}


const assetFetched = (state = initialState, action) => {
    return updateObject(state, {
        isOwner: action.isOwner,
        earnings: action.earnings
    });
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.ASSET_FETCHED:
            return assetFetched(state, action);

        default:
            return state;
    }
};

export default reducer;