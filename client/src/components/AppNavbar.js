import React, { useState } from 'react';
import {Button, Collapse, Nav, Navbar, NavbarBrand, NavbarToggler} from 'reactstrap';
import { Link } from 'react-router-dom';

const AppNavbar = () => {

    const [isOpen, setIsOpen] = useState(false);

    return (
        <Navbar color="dark" dark expand="md">
            <NavbarBrand tag={Link} to="/">Home</NavbarBrand>
            <NavbarToggler onClick={() => { setIsOpen(!isOpen) }}/>
            <Collapse isOpen={isOpen} navbar>
                <Nav className="justify-content-end" style={{width: "100%"}} navbar>
                    <Button color="link">
                        <Link to="/categories">Categories</Link>
                    </Button>

                    <Button color="link">
                        <Link to="/employees">Employees</Link>
                    </Button>

                    <Button color="link">
                        <Link to="/customer-cards">Customer Cards</Link>
                    </Button>

                    <Button color="link">
                        <Link to="/products">Products</Link>
                    </Button>

                    <Button color="link">
                        <Link to="/store-products">Store Products</Link>
                    </Button>

                    <Button color="link">
                        <Link to="/checks">Checks</Link>
                    </Button>
                </Nav>
            </Collapse>
        </Navbar>
    );
};

export default AppNavbar;