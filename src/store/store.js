import { createStore, applyMiddleware, compose } from 'redux';
import { generateContractsInitialState } from 'drizzle'
import thunkMiddleware from 'redux-thunk';
import createSagaMiddleware from 'redux-saga'

import reducers from './reducers/index';
import rootSaga from './saga/rootSaga';
import drizzleOptions from './drizzle/drizzleOptions';


// Redux DevTools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// default state
const initialState = {
    contracts: generateContractsInitialState(drizzleOptions)
};

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
    reducers,
    initialState,
    composeEnhancers(
        applyMiddleware(
            thunkMiddleware,
            sagaMiddleware
        )
    )
);

sagaMiddleware.run(rootSaga);

export default store;