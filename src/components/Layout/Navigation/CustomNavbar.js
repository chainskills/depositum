import React, {Component} from 'react';
import {Navbar, Nav, NavItem, NavLink, Collapse, NavbarBrand, NavbarToggler} from 'reactstrap';
import {Link} from 'react-router-dom';

class CustomNavbar extends Component {

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false
        };
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    render() {
        return (
            <Navbar expand="md" color="dark" dark>
                <NavbarBrand href="/">
                    <img src="/images/depositum.png" height="50" alt="Depositum"/>
                </NavbarBrand>
                <NavbarToggler onClick={this.toggle}/>
                <Collapse isOpen={this.state.isOpen} navbar>
                    <Nav className="ml-auto" navbar>
                        <NavItem>
                            <NavLink tag={Link} to={"/"}>My Assets</NavLink>
                        </NavItem>

                        <NavItem>
                            <NavLink tag={Link} to={"/marketplace"}>Marketplace</NavLink>
                        </NavItem>
                    </Nav>
                </Collapse>

            </Navbar>
        );
    }
}

export default CustomNavbar;