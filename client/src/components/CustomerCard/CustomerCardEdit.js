import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import AppNavbar from '../AppNavbar';

const CustomerCardEdit = () => {
    const initialFormState = {
        card_number: '',
        cust_surname: '',
        cust_name: '',
        cust_patronymic: '',
        phone_number: '',
        city: '',
        street: '',
        zip_code: '',
        percent: ''
    };
    const [customer, setCustomer] = useState(initialFormState);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id !== 'new') {
            fetch(`/api/customer-cards/${id}`)
                .then(response => response.json())
                .then(data => setCustomer(data));
        }
    }, [id, setCustomer]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setCustomer({ ...customer, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const response = await fetch(
            `/api/customer-cards${customer.card_number ? `/${customer.card_number}` : ''}`,
            {
                method: customer.card_number ? 'PUT' : 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(customer)
            }
        );
        if (response.ok) {
            setCustomer(initialFormState);
            navigate('/customer-cards');
        } else if(response.status === 409){
            alert("This data failed corporate integrity constraint.");
        } else {
            console.log(response)
        }
    };

    const title = <h2>{customer.card_number ? 'Edit Customer Card' : 'Add Customer Card'}</h2>;

    return (
        <div>
            <AppNavbar />
            <Container>
                {title}
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label for="cust_surname">Surname</Label>
                        <Input
                            type="text"
                            name="cust_surname"
                            id="cust_surname"
                            required
                            value={customer.cust_surname || ''}
                            onChange={handleChange}
                            autoComplete="cust_surname"
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label for="cust_name">Name</Label>
                        <Input
                            type="text"
                            name="cust_name"
                            id="cust_name"
                            required
                            value={customer.cust_name || ''}
                            onChange={handleChange}
                            autoComplete="cust_name"
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label for="cust_patronymic">Patronymic</Label>
                        <Input
                            type="text"
                            name="cust_patronymic"
                            id="cust_patronymic"
                            value={customer.cust_patronymic || ''}
                            onChange={handleChange}
                            autoComplete="cust_patronymic"
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label for="phone_number">Phone Number</Label>
                        <Input
                            type="tel"
                            name="phone_number"
                            id="phone_number"
                            required
                            value={customer.phone_number || ''}
                            onChange={handleChange}
                            autoComplete="phone_number"
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label for="city">City</Label>
                        <Input
                            type="text"
                            name="city"
                            id="city"
                            value={customer.city || ''}
                            onChange={handleChange}
                            autoComplete="city"
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label for="street">Street</Label>
                        <Input
                            type="text"
                            name="street"
                            id="street"
                            value={customer.street || ''}
                            onChange={handleChange}
                            autoComplete="street"
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label for="zip_code">Zip Code</Label>
                        <Input
                            type="text"
                            name="zip_code"
                            id="zip_code"
                            value={customer.zip_code || ''}
                            onChange={handleChange}
                            autoComplete="zip_code"
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label for="percent">Discount Percent</Label>
                        <Input
                            type="number"
                            name="percent"
                            id="percent"
                            required
                            value={customer.percent || ''}
                            onChange={handleChange}
                            autoComplete="percent"
                        />
                    </FormGroup>

                    <FormGroup>
                        <Button color="primary" type="submit">Save</Button>{' '}
                        <Button color="secondary" tag={Link} to="/customer-cards">Cancel</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div>
    );
};

export default CustomerCardEdit;