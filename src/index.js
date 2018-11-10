import React from 'react';
import ReactDOM from 'react-dom';
import {DrizzleProvider} from 'drizzle-react';
import { LoadingContainer } from 'drizzle-react-components'
import 'bootstrap/dist/css/bootstrap.min.css'

import drizzleOptions from './store/drizzle/drizzleOptions';
import store from './store/store';
import App from './App';


ReactDOM.render((
        <DrizzleProvider options={drizzleOptions} store={store}>
            <LoadingContainer>
                <App />
            </LoadingContainer>
        </DrizzleProvider>
    ),
    document.getElementById('root')
);

