import * as actionTypes from '../actions/actionTypes';
import {updateObject} from "../../shared/utility";


const initialState = {
    isOwner: false,
    earnings: 0,
    type: '',
    title: '',
    assetId: '',
    owner: '',
    name: '',
    description: '',
    imageSource: '',
    price: '',
    openTokenDialog: false,
    openAssetDialog: false,
    openMarketplace: false
}


const assetFetched = (state = initialState, action) => {
    return updateObject(state, {
        isOwner: action.isOwner,
        earnings: action.earnings
    });
};

const assetNew = (state = initialState, action) => {
    return updateObject(state, {
        type: 'new',
        title: 'Create new asset',
        assetId: '',
        owner: '',
        name: '',
        description: '',
        imageSource: '',
        price: '',
        openAssetDialog: true,
        openTokenDialog: false,
        openMarketplace: false
    });
};


const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.ASSET_FETCHED:
            return assetFetched(state, action);

        case actionTypes.ASSET_NEW:
            return assetNew(state, action);

        default:
            return state;
    }
};

export default reducer;