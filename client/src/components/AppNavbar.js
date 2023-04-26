import React, { useState } from 'react';
import {Collapse, Nav, Navbar, NavbarBrand, NavbarToggler} from 'reactstrap';
import { Link } from 'react-router-dom';
import useAuth from "../hooks/useAuth";

const AppNavbar = () => {

    const [isOpen, setIsOpen] = useState(false);
    const {auth} = useAuth();

    return (
        <Navbar color="dark" dark expand="md">
            <NavbarBrand tag={Link} to="/">Home</NavbarBrand>
            { auth?.role === "CASHIER" &&
                <NavbarBrand tag={Link} to="/cabinet">Cabinet</NavbarBrand>
            }
            <NavbarToggler onClick={() => { setIsOpen(!isOpen) }}/>
            <Collapse isOpen={isOpen} navbar>
                <Nav className="justify-content-end" style={{width: "100%"}} navbar>

                    <NavbarBrand tag={Link} to="/employees">
                        Employees
                    </NavbarBrand>

                    <NavbarBrand tag={Link} to="/customer-cards">
                        Customer Cards
                    </NavbarBrand>

                    <NavbarBrand tag={Link} to="/categories">
                        Categories
                    </NavbarBrand>

                    <NavbarBrand tag={Link} to="/products">
                        Products
                    </NavbarBrand>

                    <NavbarBrand tag={Link} to="/store-products">
                        Store Products
                    </NavbarBrand>

                    <NavbarBrand tag={Link} to="/checks">
                        Checks
                    </NavbarBrand>
                </Nav>
            </Collapse>
        </Navbar>
    );
};

export default AppNavbar;