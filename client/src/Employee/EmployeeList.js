import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from '../AppNavbar';
import { Link } from 'react-router-dom';

const EmployeeList = () => {

    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isSorted, setIsSorted] = useState(false);

    useEffect(() => {
        setLoading(true);

        fetch(`api/employees?sorted=${isSorted}`)
            .then(response => response.json())
            .then(data => {
                setEmployees(data);
                setLoading(false);
            })
    }, [isSorted]);

    const remove = async (id) => {
        await fetch(`/api/employees/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            console.log(response); // log the response to see if there are any errors
            let updatedEmployees = [...employees].filter(i => i.id_employee !== id);
            setEmployees(updatedEmployees);
        }).catch((error) => {
            console.log(error); // log any errors that occur
        });
    }

    const toggleSort = () => {
        setIsSorted(!isSorted);
    }

    if (loading) {
        return <p>Loading...</p>;
    }

    const employeeList = employees.map(employee => {
        return <tr key={employee.id_employee}>
            <td style={{whiteSpace: 'nowrap'}}>{employee.empl_surname}</td>
            <td style={{whiteSpace: 'nowrap'}}>{employee.empl_name}</td>
            <td style={{whiteSpace: 'nowrap'}}>{employee.empl_patronymic}</td>
            <td style={{whiteSpace: 'nowrap'}}>{employee.empl_role}</td>
            <td style={{whiteSpace: 'nowrap'}}>{employee.salary}</td>
            <td style={{whiteSpace: 'nowrap'}}>{employee.date_of_birth}</td>
            <td style={{whiteSpace: 'nowrap'}}>{employee.date_of_start}</td>
            <td style={{whiteSpace: 'nowrap'}}>{employee.phone_number}</td>
            <td style={{whiteSpace: 'nowrap'}}>{employee.city}</td>
            <td style={{whiteSpace: 'nowrap'}}>{employee.street}</td>
            <td style={{whiteSpace: 'nowrap'}}>{employee.zip_code}</td>
            <td>
                <ButtonGroup>
                    <Button size="sm" color="primary" tag={Link} to={"/employees/" + employee.id_employee}>Edit</Button>
                    <Button size="sm" color="danger" onClick={() => remove(employee.id_employee)}>Delete</Button>
                </ButtonGroup>
            </td>
        </tr>
    });

    return (
        <div>
            <AppNavbar/>
            <Container fluid>
                <div className="float-end">
                    <Button color="success" tag={Link} to="/employees/new">Add Employee</Button>
                    <Button color="secondary" onClick={toggleSort}>{isSorted ? 'Unsort' : 'Sort by Name'}</Button>
                </div>
                <h3>Employee List</h3>
                <Table className="mt-4">
                    <thead>
                    <tr>
                        <th>Surname</th>
                        <th>Name</th>
                        <th>Patronymic</th>
                        <th>Role</th>
                        <th>Salary</th>
                        <th>Date of Birth</th>
                        <th>Date of Start</th>
                        <th>Phone Number</th>
                        <th>City</th>
                        <th>Street</th>
                        <th>Zip Code</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {employeeList}
                    </tbody>
                </Table>
            </Container>
        </div>
    );
}

export default EmployeeList;