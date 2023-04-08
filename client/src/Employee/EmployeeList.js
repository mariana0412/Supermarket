import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Container, Table, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import AppNavbar from '../AppNavbar';
import { Link } from 'react-router-dom';

const EmployeeList = () => {

    const [employees, setEmployees] = useState([]);
    const [isSorted, setIsSorted] = useState(false);
    const [isCashierSorted, setIsCashierSorted] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        let url = 'api/employees';
        if (isSorted) {
            url += '?sorted=true';
        }
        if (isCashierSorted) {
            url += isSorted ? '&cashier=true' : '?cashier=true';
        }

        fetch(url)
            .then(response => response.json())
            .then(data => {
                setEmployees(data);
            })
    }, [isSorted, isCashierSorted]);

    const remove = async (id) => {
        try {
            const response = await fetch(`/api/employees/${id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (response.ok) {
                let updatedEmployees = [...employees].filter(i => i.id_employee !== id);
                setEmployees(updatedEmployees);
            } else {
                alert(data.message); // display error message to user
            }
        } catch (error) {
            console.log(error); // log any errors that occur
        }
    }

    const toggleSort = () => {
        setIsSorted(true);
        setIsCashierSorted(false);
    }

    const toggleCashierSort = () => {
        setIsCashierSorted(true);
        setIsSorted(true);
    }

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    }

    const unsortEmployees = () => {
        setIsSorted(false);
        setIsCashierSorted(false);
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
            <AppNavbar />
            <Container fluid>
                <h3>Employees List</h3>

                    <Button className="float-end" style={{ marginRight: '20px' }} color="success" tag={Link} to="/employees/new">Add Employee</Button>
                    <Dropdown  className="float-right" isOpen={dropdownOpen} toggle={toggleDropdown}>
                        <DropdownToggle caret>Sort by surname</DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem onClick={toggleSort}>All employees</DropdownItem>
                            <DropdownItem onClick={toggleCashierSort}>Cashiers</DropdownItem>
                            <DropdownItem onClick={unsortEmployees}>Unsort all employees</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>

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
                        <th width="10%">Actions</th>
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