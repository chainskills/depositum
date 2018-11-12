import React, { Component } from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom';

import AssetsContainer from './containers/Assets/AssetsContainer';
import MarketplaceContainer from './containers/Marketplace/MarketplaceContainer';
import Navbar from './components/Layout/Navigation/CustomNavbar';
import Footer from "./components/Layout/Footer/Footer";

import './App.css'

class App extends Component {

    render() {
       return (
            <Router>
                <div>
                    <Navbar/>
                    <Route exact path="/" component={AssetsContainer} />
                    <Route path="/marketplace" component={MarketplaceContainer} />
                    <Footer />
                </div>
            </Router>
        );
    }
}

export default App;
