import React, {Component} from 'react';

import "./Footer.css";

class Footer extends Component {
    render() {
        return (
            <footer className="page-footer font-small fixed-bottom footer">
                <div className="container">
                    <p>Powered by <a href="https://truffleframework.com/truffle">Truffle</a> and <a href="https://truffleframework.com/drizzle">Drizzle</a> - <a href="http://www.chainskills.com">ChainSkills</a> - &copy; 2018</p>
                </div>
            </footer>
        );
    }
}

export default Footer;