import React, { useState } from "react";
import axios from "axios";
import { Container, Form, FormGroup, Label, Input, Button } from "reactstrap";
import AppNavbar from "../AppNavbar";

function LoginPage() {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");

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
                    console.log('token: ' + response.data.token)
                    // redirect to the dashboard or home page
                } else {
                    // handle error if response is missing data or token
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