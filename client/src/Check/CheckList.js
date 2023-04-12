import React, { useEffect, useState } from 'react';
import {Button, ButtonGroup, Container, FormGroup, Input, Label, Table} from 'reactstrap';
import AppNavbar from '../AppNavbar';
import '../App.css';

const CheckList = () => {

    const [checks, setChecks] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [cashiers, setCashiers] = useState([]);
    const [selectedCashier, setSelectedCashier] = useState(null);
    const [showEmpty, setShowEmpty] = useState(false);
    const [totalSum, setTotalSum] = useState(0);

    useEffect(() => {
        let url = `api/checks`;
        if(startDate && endDate && selectedCashier)
            url += `?cashierId=${selectedCashier}&startDate=${startDate}&endDate=${endDate}`
        else if(startDate && endDate)
            url += `?startDate=${startDate}&endDate=${endDate}`

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
                    setTotalSum(data.reduce((accumulator, object) => accumulator + object.sum_total, 0))
                    setShowEmpty(data.length === 0);
                } else {
                    setChecks([]);
                    setTotalSum(0);
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

    const checksList = checks.map(check => {
        return <tr key={check.check_number}>
            <td>{check.check_number}</td>
            <td>{check.id_employee}</td>
            <td>{check.card_number}</td>
            <td>{check.print_date}</td>
            <td>{check.sum_total}</td>
            <td>{check.vat}</td>
            <td>
                <ButtonGroup>
                    <Button size="sm" color="danger" onClick={() => remove(check.check_number)}>Delete</Button>
                </ButtonGroup>
            </td>
        </tr>
    });

    const cashierOptions = cashiers.map((cashier) => {
        return (
            <option key={cashier.id_employee} value={cashier.id_employee}>
                {cashier.id_employee} - {cashier.empl_surname} {cashier.empl_name} {cashier.empl_patronymic}
            </option>
        );
    });

    const handleStartDate = event => setStartDate(event.target.value);
    const handleEndDate = event => setEndDate(event.target.value);
    const handleCashier = event => setSelectedCashier(event.target.value);

    return (
        <div>
            <AppNavbar/>
            <Container fluid>
                <h3>Checks List</h3>
                <Label> Total sum: {totalSum}</Label>

                <div className="checks-filter">
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
                </div>

                <div className="float-end">
                    <Button className="buttonWithMargins" onClick={() => window.print()}>
                        Print
                    </Button>
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
                    {checksList}
                    </tbody>
                </Table>
                }
            </Container>
        </div>
    );
};

export default CheckList;
