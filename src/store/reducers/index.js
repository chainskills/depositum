import { combineReducers } from 'redux';
import { drizzleReducers } from 'drizzle'

import assetReducer from './assetReducer';

const reducers = combineReducers({
    assets: assetReducer,
    ...drizzleReducers
});

export default reducers;