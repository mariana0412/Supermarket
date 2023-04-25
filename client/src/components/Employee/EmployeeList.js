import React, {useEffect, useRef, useState} from 'react';
import {
    Button, ButtonGroup, Container, Table, Dropdown, DropdownToggle, DropdownMenu, DropdownItem,
    Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label
} from 'reactstrap';
import AppNavbar from '../AppNavbar';
import { Link } from 'react-router-dom';
import '../../App.css';
import useAuth from "../../hooks/useAuth";
import {useReactToPrint} from "react-to-print";

const EmployeeList = () => {

    const [employees, setEmployees] = useState([]);
    const [contactInfo, setContactInfo] = useState(null);
    const [searchSurname, setSearchSurname] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [contactInfoModal, setContactInfoModal] = useState(false);
    const [statisticsModal, setStatisticsModal] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [sortOption, setSortOption] = useState(null);
    const [statistics, setStatistics] = useState([]);
    const [showStatistics, setShowStatistics] = useState(false);
    const {auth} = useAuth();
    const componentPDF = useRef();

    useEffect(() => {
        let url = 'api/employees';
        if (sortOption === 'allSorted')
            url += '?sorted=true';
        else if (sortOption === 'cashiersSorted')
            url += '?sorted=true&cashier=true';

        fetch(url, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`,
            }
        })
            .then(response => response.json())
            .then(data => {
                setEmployees(data);
            })
    }, [sortOption]);

    const remove = async (id) => {
        try {
            const response = await fetch(`/api/employees/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (response.ok) {
                let updatedEmployees = [...employees].filter(i => i.id_employee !== id);
                setEmployees(updatedEmployees);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const toggleSort = (option) => {
        if (sortOption === option)
            setSortOption(null);
        else
            setSortOption(option);
    }

    const handleSearchInputChange = (event) => setSearchSurname(event.target.value);
    const handleStartDate = event => setStartDate(event.target.value);
    const handleEndDate = event => setEndDate(event.target.value);
    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

    const toggleContactInfoModal = () => {
        setContactInfoModal(!contactInfoModal);
        if(contactInfoModal)
            setSearchSurname('');
    };

    const toggleStatisticsModal = () => {
        setStatisticsModal(!statisticsModal);
        if(statisticsModal) {
            setStartDate('');
            setEndDate('');
            setShowStatistics(false);
            setStatistics([]);
        }
    };

    const showContactInfo = async () => {
        try {
            const response = await fetch(`/api/employees/contact-info?surname=${searchSurname}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (response.status === 204) {
                alert('There is no employee with such a surname.');
            } else {
                const data = await response.json();
                setContactInfo(data[0]);
                toggleContactInfoModal();
            }
        } catch (error) {
            console.log(error);
        }
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
            {
                auth?.role === "MANAGER"
                &&
                <td>
                    <ButtonGroup>
                        <Button className="buttonWithMargins" size="sm" color="primary" tag={Link} to={"/employees/" + employee.id_employee}>Edit</Button>
                        <Button className="buttonWithMargins" size="sm" color="danger" onClick={() => remove(employee.id_employee)}>Delete</Button>
                    </ButtonGroup>
                </td>
            }
        </tr>
    });

    const generatePDF = useReactToPrint({
        content: () => componentPDF.current,
        documentTitle: "Employees",
    });

    const getStatistics = async (startDate, endDate) => {
        try {
            const response = await fetch(`/api/employees/statistics?startDate=${startDate}&endDate=${endDate}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            });
            const data = await response.json();
            setStatistics(data);
            setShowStatistics(true);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <AppNavbar/>
            <Container fluid>
                <div className="float-end">
                    { auth?.role === "MANAGER"
                        &&
                        <Button className="buttonWithMargins" onClick={toggleStatisticsModal}>
                            Statistics
                        </Button>
                    }
                    { auth?.role === "MANAGER"
                        &&
                        <Button className="buttonWithMargins" onClick={generatePDF}>
                            Print
                        </Button>
                    }
                    { auth?.role === "MANAGER"
                        &&
                        <Button className="buttonWithMargins" color="success" tag={Link} to="/employees/new">
                            Add Employee
                        </Button>
                    }
                    { auth?.role === "MANAGER"
                        &&
                        <Dropdown className="buttonWithMargins"  isOpen={dropdownOpen} toggle={toggleDropdown}>
                            <DropdownToggle caret>Sort by surname</DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem onClick={() => toggleSort('allSorted')}>all employees</DropdownItem>
                                <DropdownItem onClick={() => toggleSort('cashiersSorted')}>cashiers</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    }
                </div>

                <div ref={componentPDF}>
                    <h1>Employees</h1>
                    { auth?.role === "MANAGER"
                        &&
                        <div className='search-container noPrint'>
                            <Input type="text" placeholder="Search by Surname" value={searchSurname} onChange={handleSearchInputChange} />
                            <Button color="primary" onClick={() => showContactInfo()}>Search</Button>
                        </div>
                    }
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
                            { auth?.role === "MANAGER" && <th width="10%">Actions</th> }
                        </tr>
                        </thead>
                        <tbody>
                        {employeeList}
                        </tbody>
                    </Table>
                </div>

                <Modal isOpen={statisticsModal} toggle={toggleStatisticsModal}>
                    <ModalHeader toggle={toggleStatisticsModal}>Total sum per cashier</ModalHeader>
                    <ModalBody>
                        {!showStatistics ?
                            <div>
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

                        <Button color="secondary" onClick={() => getStatistics(startDate, endDate)}>Find</Button>
                            </div>
                            :
                            <div>
                                <h1>Results</h1>
                                {statistics.map(employee => (
                                <>
                                    <p>{employee.empl_surname} {employee.empl_name} {employee.empl_patronymic} - {employee.total_sum}</p>
                                </>
                                )
                            )}
                            </div>
                        }
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={toggleStatisticsModal}>Close</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={contactInfoModal} toggle={toggleContactInfoModal}>
                    <ModalHeader toggle={toggleContactInfoModal}>Contact Info</ModalHeader>
                    <ModalBody>
                        {contactInfo && (
                            <>
                                <p>Phone Number: {contactInfo?.phone_number}</p>
                                <p>City: {contactInfo?.city}</p>
                                <p>Street: {contactInfo?.street}</p>
                                <p>Zip-code: {contactInfo?.zip_code}</p>
                            </>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={toggleContactInfoModal}>Close</Button>
                    </ModalFooter>
                </Modal>
            </Container>
        </div>
    );
}

export default EmployeeList;