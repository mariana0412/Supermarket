import React, { useState } from 'react';
import './App.css';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';

const Home = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleLoginSubmit = (event) => {
        event.preventDefault();
        console.log('Logging in with username:', username, 'and password:', password);
    };

    return (
        <div>
            <AppNavbar />
            <header className="header">
                <h1>Supermarket Zlagoda</h1>
                <Form onSubmit={handleLoginSubmit} className="login-form">
                    <FormGroup>
                        <Label for="username">Username</Label>
                        <Input type="text" name="username" id="username" value={username} onChange={handleUsernameChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="password">Password</Label>
                        <Input type="password" name="password" id="password" value={password} onChange={handlePasswordChange} />
                    </FormGroup>
                    <Button color="primary" type="submit">
                        Login
                    </Button>
                </Form>
            </header>

            <Container fluid>
                <Button color="link">
                    <Link to="/categories">Manage Categories</Link>
                </Button>

                <Button color="link">
                    <Link to="/employees">Manage Employees</Link>
                </Button>

                <Button color="link">
                    <Link to="/customer-cards">Manage Customer Cards</Link>
                </Button>

                <Button color="link">
                    <Link to="/products">Manage Products</Link>
                </Button>

                <Button color="link">
                    <Link to="/store-products">Manage Store Products</Link>
                </Button>

                <Button color="link">
                    <Link to="/checks">Manage Checks</Link>
                </Button>

            </Container>
        </div>
    );
};

export default Home;