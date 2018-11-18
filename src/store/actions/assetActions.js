import * as actionTypes from './actionTypes';


export const updateMenu = (message) => {
    return {
        type: actionTypes.UPDATE_MENU,
        message: message
    };
};
