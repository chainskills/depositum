import React, {Component} from 'react';
import {drizzleConnect} from 'drizzle-react';
import {
    Navbar,
    Nav,
    NavItem,
    NavLink,
    Collapse,
    NavbarBrand,
    NavbarToggler,
    UncontrolledDropdown,
    DropdownItem,
    DropdownToggle,
    DropdownMenu,
} from 'reactstrap';
import {Link} from 'react-router-dom';

import "./CustomNavbar.css";
import * as actions from "../../../store/actions/assetActions";

class CustomNavbar extends Component {

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false,
            dropdownOpen: false
        };
    }

    toggle= () => {
        this.setState({
            isOpen: !this.state.isOpen,
            dropdownOpen: !this.state.dropdownOpen
        });
    }


    handleNewAsset = () => {
        this.props.onNewAsset();
    }

    render() {

        console.log("IsOwner? " + this.props.isOwner);
        console.log("Earnings: " + this.props.earnings);


        return (
            <Navbar expand="md" color="dark" dark>
                <NavbarBrand href="/">
                    <img src="/images/depositum.png" height="50" alt="Depositum"/>
                </NavbarBrand>
                <NavbarToggler onClick={this.toggle}/>
                <Collapse isOpen={this.state.isOpen} navbar>
                    <Nav className="ml-auto" navbar>
                        <NavItem >
                            <NavLink tag={Link} to={"/"}>My Asset</NavLink>
                        </NavItem>

                        <NavItem>
                            <NavLink tag={Link} to={"/marketplace"}>Marketplace</NavLink>
                        </NavItem>

                        <UncontrolledDropdown nav inNavbar>
                            <DropdownToggle nav caret>
                                Asset
                            </DropdownToggle>
                            <DropdownMenu right>
                                <DropdownItem>
                                    <NavLink tag={Link} to={"/"} className="submenu">
                                        All assets
                                    </NavLink>
                                </DropdownItem>
                                <DropdownItem onClick={() => this.handleNewAsset()}>
                                    <NavLink tag={Link} to={"/"} className="submenu">
                                        New asset
                                    </NavLink>
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>

                        <UncontrolledDropdown nav inNavbar>
                            <DropdownToggle nav caret>
                                Options
                            </DropdownToggle>
                            <DropdownMenu right>
                                <DropdownItem>
                                <NavLink tag={Link} to={"/marketplace"} className="submenu">
                                        Marketplace
                                </NavLink>
                                </DropdownItem>
                                <DropdownItem>
                                    <NavLink tag={Link} to={"/"} className="submenu">
                                            Assets
                                    </NavLink>
                                </DropdownItem>
                                {this.props.isOwner &&
                                <DropdownItem className="submenu">
                                    Reset
                                </DropdownItem>
                                }

                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </Nav>
                </Collapse>

            </Navbar>
        );
    }
}

const mapStateToProps = state => {
    return {
        isOwner: state.assets.isOwner,
        earnings: state.assets.earnings
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onNewAsset: () => {
            dispatch(actions.newAsset())
        }
    };
};

export default drizzleConnect(CustomNavbar, mapStateToProps, mapDispatchToProps);