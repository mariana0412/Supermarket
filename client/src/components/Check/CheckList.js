import React, {useEffect, useRef, useState} from 'react';
import {Button, Container, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Table} from 'reactstrap';
import AppNavbar from '../AppNavbar';
import '../../App.css';
import Check from "./Check";
import useAuth from "../../hooks/useAuth";
import {useReactToPrint} from "react-to-print";
import {Link} from "react-router-dom";

const CheckList = () => {

    const [checks, setChecks] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [cashiers, setCashiers] = useState([]);
    const [selectedCashier, setSelectedCashier] = useState(null);
    const [showEmpty, setShowEmpty] = useState(false);
    const [totalSum, setTotalSum] = useState(null);
    const [modal, setModal] = useState(false);
    const [purchasedProducts, setPurchasedProducts] = useState(null);
    const {auth} = useAuth();
    const componentPDF = useRef();

    useEffect(() => {
        let url = `api/checks`;
        if(startDate && endDate && selectedCashier) {
            url += `?cashierId=${selectedCashier}&startDate=${startDate}&endDate=${endDate}`;
            showTotalSum();
        }
        else if(startDate && endDate) {
            url += `?startDate=${startDate}&endDate=${endDate}`;
            showTotalSum();
        }

        fetch(url)
            .then(response => {
                if (response.status === 204)
                    return null;
                else
                    return response.json();
            })
            .then(data => {
                if (data) {
                    setChecks(data);
                    setShowEmpty(data.length === 0);
                } else {
                    setChecks([]);
                    setShowEmpty(true);
                }
            })
    }, [startDate, endDate, selectedCashier]);

    useEffect(() => {
        let url = `api/employees?cashier=true`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                setCashiers(data);
            })
    });

    // TODO: fix bug: after clicking DELETE check is removed from DB but is present on the screen
    const remove = async (id) => {
        try {
            const response = await fetch(`/api/checks/${id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (response.ok) {
                let updatedChecks = [...checks].filter(i => i.check_number !== id);
                setChecks(updatedChecks);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const checksList = ({ checks, remove, showPurchasedProducts }) => checks.map(check => (
            <Check
                auth={auth}
                check={check}
                remove={remove}
                showPurchasedProducts={showPurchasedProducts}
            />
        ));

    const cashierOptions = cashiers.map((cashier) =>
            <option key={cashier.id_employee} value={cashier.id_employee}>
                {cashier.id_employee} - {cashier.empl_surname} {cashier.empl_name} {cashier.empl_patronymic}
            </option>
    );

    const handleStartDate = event => setStartDate(event.target.value);
    const handleEndDate = event => setEndDate(event.target.value);
    const handleCashier = event => setSelectedCashier(event.target.value);
    const toggleModal = () => setModal(!modal);

    const showPurchasedProducts = async (checkNumber) => {
        try {
            const response = await fetch(`/api/sales?checkNumber=${checkNumber}`);
            if (response.status === 204) {
                alert('There is no products in this check.');
            } else {
                const data = await response.json();
                console.log(data);
                setPurchasedProducts(data);
                toggleModal();
            }
        } catch (error) {
            console.log(error);
        }
    }

    const showTotalSum = async () => {
        try {
            let url = `/api/checks-sum?startDate=${startDate}&endDate=${endDate}`;
            if(selectedCashier)
                url += `&cashierId=${selectedCashier}`;
            const response = await fetch(url);
            const data = await response.json();
            setTotalSum(data);
        } catch (error) {
            console.log(error);
        }
    }

    const generatePDF = useReactToPrint({
        content: () => componentPDF.current,
        documentTitle: "Checks",
    });

    return (
        <div>
            <AppNavbar/>
            <Container fluid>
                <div className="float-end">
                    { auth?.role === "MANAGER"
                        &&
                        <Button className="float-end buttonWithMargins" onClick={generatePDF}>
                            Print
                        </Button>
                    }
                    { auth?.role === "CASHIER"
                        &&
                        <Button className="buttonWithMargins" color="success" tag={Link} to="/checks/new">
                            Add Check
                        </Button>
                    }
                </div>
                <div ref={componentPDF} style={{width: '100%'}}>
                    <h1>Checks</h1>

                    <div className="checks-filter noPrint">
                        <FormGroup>
                            <Label for="startDate">Start date and time: </Label>
                            <Input
                                style={{ display: 'inline-block', width: '200px'}}
                                type="datetime-local"
                                name="startDate"
                                id="startDate"
                                value={startDate}
                                required
                                onChange={handleStartDate}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label for="endDate">End date and time: </Label>
                            <Input
                                style={{ display: 'inline-block', width: '200px'}}
                                type="datetime-local"
                                name="endDate"
                                id="endDate"
                                value={endDate}
                                required
                                onChange={handleEndDate}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Input style={{width: '200px'}}
                                   type="select"
                                   name="id_employee"
                                   id="id_employee"
                                   onChange={handleCashier}>
                                <option value="">Select Cashier</option>
                                {cashierOptions}
                            </Input>
                        </FormGroup>

                        {totalSum && <>Total sum: ${totalSum}</>}
                    </div>
                    {showEmpty ?
                        <div className="text-center">
                            <p>No results found.</p>
                        </div>
                        :
                        <Table className="mt-4">
                            <thead>
                            <tr>
                                <th>Check Number</th>
                                <th>Cashier ID</th>
                                <th>Card Number</th>
                                <th>Print Date</th>
                                <th>Total Sum</th>
                                <th>Vat</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {checksList ({ checks, remove, showPurchasedProducts })}
                            </tbody>
                        </Table>
                    }
                </div>

                <Modal isOpen={modal} toggle={toggleModal} >
                    <ModalHeader toggle={toggleModal}>Purchased Products</ModalHeader>
                    <ModalBody>
                        {purchasedProducts && (purchasedProducts.map(p =>
                            <>
                                <p>Name: {p?.product_name}</p>
                                <p>Products number: {p?.product_number}</p>
                                <p>Selling price: {p?.selling_price}</p>
                                <br></br>
                            </>
                            )
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={toggleModal}>Close</Button>
                    </ModalFooter>
                </Modal>
            </Container>
        </div>
    );
};

export default CheckList;
