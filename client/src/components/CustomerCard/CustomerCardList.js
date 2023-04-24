import React, {useEffect, useRef, useState} from 'react';
import {Button, ButtonGroup, Container, Input, Table} from 'reactstrap';
import AppNavbar from '../AppNavbar';
import { Link } from 'react-router-dom';
import '../../App.css';
import useAuth from "../../hooks/useAuth";
import SearchBySurnameModal from "./SearchBySurnameModal";
import {useReactToPrint} from "react-to-print";

const CustomerCardList = () => {

    const [customerCards, setCustomerCards] = useState([]);
    const [sorted, setSorted] = useState(false);
    const [salePercent, setSalePercent] = useState(false);
    const [showEmpty, setShowEmpty] = useState(false);
    const [searchSurname, setSearchSurname] = useState('');
    const [customersFoundBySurname, setCustomersFoundBySurname] = useState([]);
    const [modalSearchBySurname, setModalSearchBySurname] = useState(false);
    const {auth} = useAuth();
    const componentPDF = useRef();

    useEffect(() => {
        let url = 'api/customer-cards';
        if (sorted)
            url += '?sorted=true';
        else if(salePercent)
            url += '?salePercent=' + salePercent;

        fetch(url, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            },
        })
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
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
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

    const handleSalePercentChange = (event) => setSalePercent(event.target.value);
    const handleSearchProductNameChange = (event) => setSearchSurname(event.target.value);

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
                            <Button className="buttonWithMargins" size="sm" color="primary" tag={Link}
                                    to={"/customer-cards/" + customerCard.card_number}>
                                Edit
                            </Button>

                            { auth?.role === "MANAGER" &&
                                <Button className="buttonWithMargins" size="sm" color="danger" onClick={() => remove(customerCard.card_number)}>
                                    Delete
                                </Button>
                            }
                        </ButtonGroup>
                    </td>
                </tr>
            );
        });
    }

    const toggleModalSearchBySurname = () => setModalSearchBySurname(!modalSearchBySurname);
    const findCustomersBySurname = async () => {
        try {
            const response = await fetch(`/api/customer-cards?surname=${searchSurname}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                },
            });
            if (response.status === 204) {
                alert('There is no customers with this surname.');
            } else {
                const data = await response.json();
                setCustomersFoundBySurname(data);
                toggleModalSearchBySurname();
            }
        } catch (error) {
            console.log(error);
        }
    }

    const generatePDF = useReactToPrint({
        content: () => componentPDF.current,
        documentTitle: "Customer Cards",
    });

    return (
        <div>
            <AppNavbar/>
            <Container fluid>
                <div>
                    <div className="float-end">
                        <Button className="buttonWithMargins" color="primary" onClick={() => setSorted(!sorted)}>
                            {sorted ? "Unsort" : "Sort by Surname"}
                        </Button>
                        <Button className="buttonWithMargins" color="success" tag={Link} to="/customer-cards/new">
                            Add Customer Card
                        </Button>
                        { auth?.role === "MANAGER"
                            &&
                            <Button className="buttonWithMargins" onClick={generatePDF}>
                                Print
                            </Button>
                        }
                    </div>
                </div>

                <div ref={componentPDF}>
                    <h1>Customer Cards</h1>

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
                    { auth?.role === "CASHIER"
                        &&
                        <div className='search-container noPrint'>
                            <Input
                                style={{width: '200px' }}
                                type="text"
                                placeholder="Find by name"
                                value={searchSurname}
                                onChange={handleSearchProductNameChange}
                            />
                            <Button color="primary" onClick={() => findCustomersBySurname()}>Search</Button>
                        </div>
                    }

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
                </div>

                <SearchBySurnameModal
                    isOpen={modalSearchBySurname}
                    toggle={toggleModalSearchBySurname}
                    customers={customersFoundBySurname}
                />
            </Container>
        </div>
    );
}

export default CustomerCardList;