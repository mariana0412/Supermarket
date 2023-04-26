import React, {useEffect, useState} from "react";
import useAuth from "../hooks/useAuth";
import {Container, Table} from "reactstrap";
import AppNavbar from "./AppNavbar";
import useLastPath from "../hooks/useLastPath";

const CashierCabinet = () => {
    const [employee, setEmployee] = useState({});
    const {auth} = useAuth();
    useLastPath();

    useEffect(() => {
        console.log(auth?.id_employee);
        fetch(`/api/employees/${auth?.employeeId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            },
        })
            .then(response => {
                console.log(response);
                return response.json();
            })
            .then(data => {
                const renamedKeys = {
                    Surname: data.empl_surname,
                    Name: data.empl_name,
                    Patronymic: data?.empl_patronymic,
                    Role: data.empl_role,
                    Salary: data.salary,
                    'Date of Birth': data.date_of_birth,
                    'Date of start': data.date_of_start,
                    'Phone number': data.phone_number,
                    City: data.city,
                    Street: data.street,
                    Zip: data.zip_code
                };
                setEmployee(renamedKeys);
            })
            .catch(error => console.log(error));
    }, []);

    return (
        <div>
            <AppNavbar />
            <Container fluid>
                <h1>My Profile</h1>
                <Table className="mt-4" bordered>
                    <tbody>
                    {Object.entries(employee).map(([key, value]) => (
                        <tr key={key}>
                            <td style={{ fontWeight: "bold" }}>{key}</td>
                            <td>{value}</td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </Container>
        </div>
    );
}

export default CashierCabinet;