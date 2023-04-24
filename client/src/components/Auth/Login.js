import React, {useEffect, useState} from "react";
import axios from "axios";
import { Container, Form, FormGroup, Label, Input, Button } from "reactstrap";
import AppNavbar from "../AppNavbar";
import useAuth from '../../hooks/useAuth.js';
import jwt_decode from 'jwt-decode';
import {useNavigate} from "react-router-dom";

function LoginPage() {
    const {setAuth} = useAuth();
    const navigate = useNavigate();
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decodedToken = jwt_decode(token);
            const role = decodedToken.role;
            const employeeId = decodedToken.id_employee;
            setAuth({ role, employeeId, token });
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        axios
            .post("api/auth/authenticate", {
                phone_number: phoneNumber,
                user_password: password,
            })
            .then((response) => {
                if (response.data && response.data.token) {
                    localStorage.setItem('token', response.data.token);

                    const accessToken = response?.data?.token;
                    const role = jwt_decode(accessToken).role;
                    const employeeId = jwt_decode(accessToken).id_employee
                    setAuth({ role, employeeId, accessToken});

                    console.log(role);
                    console.log('token: ' + response.data.token)

                    navigate('/');
                } else {
                    console.error('Invalid API response:', response);
                }
            })
            .catch((error) => {
                console.error(error);
                if (error.response && error.response.status === 403) {
                    alert("Incorrect phone number or password");
                } else {
                    alert("An error occurred");
                }
            });
    };

    return (
        <div>
            <AppNavbar />
            <Container>
                <h2>Login</h2>
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label for="phoneNumber">Phone Number</Label>
                        <Input
                            type="tel"
                            name="phoneNumber"
                            id="phoneNumber"
                            required
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            autoComplete="phoneNumber"
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label for="password">Password</Label>
                        <Input
                            type="password"
                            name="password"
                            id="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                        />
                    </FormGroup>

                    <Button type="submit" color="primary">Login</Button>
                </Form>
            </Container>
        </div>
    );
}

export default LoginPage;