import React, { useEffect, useState } from 'react';
import {Button, ButtonGroup, Container, Input, Table} from 'reactstrap';
import AppNavbar from '../AppNavbar';
import { Link } from 'react-router-dom';
import '../../App.css';
import useAuth from "../../hooks/useAuth";

const CustomerCardList = () => {

    const [customerCards, setCustomerCards] = useState([]);
    const [sorted, setSorted] = useState(false);
    const [salePercent, setSalePercent] = useState(false);
    const [showEmpty, setShowEmpty] = useState(false);
    const {auth} = useAuth();

    useEffect(() => {
        let url = 'api/customer-cards';
        if (sorted)
            url += '?sorted=true';
        else if(salePercent)
            url += '?salePercent=' + salePercent;

        fetch(url)
            .then(response => {
                if (response.status === 204)
                    return null;
                else
                    return response.json();
            })
            .then(data => {
                if (data) {
                    setCustomerCards(data);
                    setShowEmpty(data.length === 0);
                } else {
                    setCustomerCards([]);
                    setShowEmpty(true);
                }
            })
            .catch(error => console.log(error));
    }, [sorted, salePercent]);

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

    const handleSalePercentChange = (event) => {
        setSalePercent(event.target.value);
    }

    let customerCardList = <tr><td colSpan="10" style={{ textAlign: "center" }}>No results found.</td></tr>;

    if (customerCards.length > 0) {
        customerCardList = customerCards.map(customerCard => {
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
                            <Button size="sm" color="primary" tag={Link}
                                    to={"/customer-cards/" + customerCard.card_number}>
                                Edit
                            </Button>

                            { auth?.role === "MANAGER" &&
                                <Button size="sm" color="danger" onClick={() => remove(customerCard.card_number)}>
                                    Delete
                                </Button>
                            }
                        </ButtonGroup>
                    </td>
                </tr>
            );
        });
    }

    return (
        <div>
            <AppNavbar/>
            <Container fluid>
                <h3>Customer Cards List</h3>
                <div>
                    <div className="float-end">
                        { auth?.role === "MANAGER"
                            &&
                            <Button className="buttonWithMargins" color="primary" onClick={() => setSorted(!sorted)}>
                                {sorted ? "Unsort" : "Sort by Surname"}
                            </Button>
                        }
                        { auth?.role === "MANAGER"
                            &&
                            <Button className="buttonWithMargins" color="success" tag={Link} to="/customer-cards/new">
                                Add Customer Card
                            </Button>
                        }
                        { auth?.role === "CASHIER"
                            &&
                            <Button className="buttonWithMargins" onClick={() => window.print()}>
                                Print
                            </Button>
                        }
                    </div>
                    { auth?.role === "MANAGER"
                        &&
                        <div className='search-container'>
                            <Input
                                style={{width: '200px' }}
                                type="number"
                                placeholder="Enter sale percent"
                                value={salePercent}
                                onChange={handleSalePercentChange}
                            />
                        </div>
                    }
                </div>

                {showEmpty ?
                    <div className="text-center">
                        <p>No results found.</p>
                    </div>
                    :
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
                }
            </Container>
        </div>
    );
}

export default CustomerCardList;