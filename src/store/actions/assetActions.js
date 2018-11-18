import * as actionTypes from './actionTypes';


export const updateMenu = (isOwner, earnings) => {
    return {
        type: actionTypes.ASSET_FETCHED,
        isOwner: isOwner,
        earnings: earnings
    };
};


export const newAsset = () => {
    return {
        type: actionTypes.ASSET_NEW
    };
};
