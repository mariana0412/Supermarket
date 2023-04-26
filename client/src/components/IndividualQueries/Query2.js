import React, { useEffect, useState, useRef } from 'react';
import {
    Container,
    Table
} from 'reactstrap';
import AppNavbar from '../AppNavbar';
import '../../App.css'

const Query2 = () => {
    const initialFormState = {
        card_number: '',
        cust_name: '',
        cust_surname: ''
    };
    const [listElem, setListElem] = useState([]);

    useEffect(() => {
        fetch(`/api/query2`)
            .then(response => response.json())
            .then(data => {
                setListElem(data);
            });
    }, []);

    const categoryList = listElem.map(listElem => {
        return <tr key={listElem.card_number}>
            <td>{listElem.card_number}</td>
            <td>{listElem.cust_name}</td>
            <td>{listElem.cust_surname}</td>
        </tr>
    });

    return (
        <div>
            <AppNavbar/>
            <Container fluid>
                <Table className="mt-4">
                    <thead>
                    <tr>
                        <th>Card Number</th>
                        <th>Customer name</th>
                        <th>Customer surname</th>
                    </tr>
                    </thead>
                    <tbody>
                    {categoryList}
                    </tbody>
                </Table>
            </Container>
        </div>
    );
}
export default Query2;