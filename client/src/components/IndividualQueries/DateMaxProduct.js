import React, { useEffect, useState, useRef } from 'react';
import {
    Container,
    Table
} from 'reactstrap';
import AppNavbar from '../AppNavbar';
import useAuth from "../../hooks/useAuth";
import '../../App.css'

const DateMaxProduct = () => {
    const initialFormState = {
        print_date: '',
        max_sells: ''
    };
    const [listElem, setListElem] = useState([]);
    const { c } = useParams();

    useEffect(() => {
        fetch(`/api/dateMaxProduct/${c}`)
            .then(response => response.json())
            .then(data => {
                setListElem(data);
            });
    }, [c]);

    const categoryList = listElem.map(listElem => {
        return <tr key={listElem.print_date}>
            <td>{listElem.print_date}</td>
            <td>{listElem.max_sells}</td>
        </tr>
    });

    return (
        <div>
            <AppNavbar/>
            <Container fluid>
                <Table className="mt-4">
                    <thead>
                    <tr>
                        <th>Date</th>
                        <th>Number of sells</th>
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
export default DateMaxProduct;