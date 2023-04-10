import React, { useEffect, useState } from 'react';
import {Button, ButtonGroup, Container, Table} from 'reactstrap';
import AppNavbar from '../AppNavbar';
import { Link } from 'react-router-dom';

const CustomerCardList = () => {

    const [customerCards, setCustomerCards] = useState([]);
    const [sorted, setSorted] = useState(false);

    useEffect(() => {
        let url = 'api/customer-cards';
        if (sorted) {
            url += '?sorted=true';
        }

        fetch(url)
            .then(response => response.json())
            .then(data => {
                setCustomerCards(data);
            });
    }, [sorted]);

    const remove = async (id) => {
        try {
            const response = await fetch(`/api/customer-cards/${id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (response.ok) {
                let updatedCustomerCards = [...customerCards].filter(i => i.card_number !== id);
                setCustomerCards(updatedCustomerCards);
            } else {
                alert(data.message); // display error message to user
            }
        } catch (error) {
            console.log(error); // log any errors that occur
        }
    }

    const customerCardList = customerCards.map(customerCard => {
        return (
            <tr key={customerCard.card_number}>
                <td>{customerCard.card_number}</td>
                <td>{customerCard.cust_surname}</td>
                <td>{customerCard.cust_name}</td>
                <td>{customerCard.cust_patronymic}</td>
                <td>{customerCard.phone_number}</td>
                <td>{customerCard.city}</td>
                <td>{customerCard.street}</td>
                <td>{customerCard.zip_code}</td>
                <td>{customerCard.percent}</td>
                <td>
                    <ButtonGroup>
                        <Button size="sm" color="primary" tag={Link} to={"/customer-cards/" + customerCard.card_number}>Edit</Button>
                        <Button size="sm" color="danger" onClick={() => remove(customerCard.card_number)}>Delete</Button>
                    </ButtonGroup>
                </td>
            </tr>
        );
    });

    return (
        <div>
            <AppNavbar/>
            <Container fluid>
                <div className="float-end">
                    <Button color="success" tag={Link} to="/customer-cards/new">Add Customer Card</Button>
                    <Button color="primary" onClick={() => setSorted(!sorted)}>
                        {sorted ? "Unsort" : "Sort by Surname"}
                    </Button>
                    <Button onClick={() => window.print()}>Print</Button>
                </div>

                <h3>Customer Cards List</h3>

                <Table className="mt-4">
                    <thead>
                    <tr>
                        <th>Card Number</th>
                        <th>Surname</th>
                        <th>Name</th>
                        <th>Patronymic</th>
                        <th>Phone Number</th>
                        <th>City</th>
                        <th>Street</th>
                        <th>Zip Code</th>
                        <th>Percent</th>
                        <th width="10%">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {customerCardList}
                    </tbody>
                </Table>
            </Container>
        </div>
    );
}

export default CustomerCardList;