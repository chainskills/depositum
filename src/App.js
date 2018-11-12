import React, { Component } from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom';

import Home from './components/Home/Home';
import AssetsContainer from './containers/Assets/AssetsContainer';
import MarketplaceContainer from './containers/Marketplace/MarketplaceContainer';
import About from "./components/About/About";
import Navbar from './components/Layout/Navigation/CustomNavbar';
import Footer from "./components/Layout/Footer/Footer";

import './App.css'

class App extends Component {

    render() {
       return (
            <Router>
                <div>
                    <Navbar/>
                    <Route exact path="/" component={Home} />
                    <Route path="/marketplace" component={MarketplaceContainer} />
                    <Route path="/assets" component={AssetsContainer} />
                    <Route path="/about" component={About} />
                    <Footer />
                </div>
            </Router>
        );
    }
}

export default App;
