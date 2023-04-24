import React, { useEffect, useState, useRef } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from '../AppNavbar';
import { Link } from 'react-router-dom';
import useAuth from "../../hooks/useAuth";
import {useReactToPrint} from 'react-to-print';
import '../../App.css'

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [sorted, setSorted] = useState(false);
    const {auth} = useAuth();
    const componentPDF = useRef();

    useEffect(() => {
        const url = sorted ? "api/categories?sorted=true" : "api/categories";

        fetch(url, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                setCategories(data);
            })
    }, [sorted]);

    const remove = async (id) => {
        try {
            const response = await fetch(`/api/categories/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (response.ok) {
                let updatedCategories = [...categories].filter(i => i.category_number !== id);
                setCategories(updatedCategories);
            } else {
                alert(data.message); // display error message to user
            }
        } catch (error) {
            console.log(error); // log any errors that occur
        }
    }

    const categoryList = categories.map(category => {
        return <tr key={category.category_number}>
            <td style={{whiteSpace: 'nowrap'}}>{category.category_name}</td>
            { auth?.role === "MANAGER"
                &&
                <td>
                    <ButtonGroup>
                        <Button className="buttonWithMargins" size="sm" color="primary" tag={Link} to={"/categories/" + category.category_number}>Edit</Button>
                        <Button className="buttonWithMargins" size="sm" color="danger" onClick={() => remove(category.category_number)}>Delete</Button>
                    </ButtonGroup>
                </td>
            }
        </tr>
    });

    const generatePDF = useReactToPrint({
        content: () => componentPDF.current,
        documentTitle: "Categories",
    });

    return (
        <div>
            <AppNavbar/>
            <Container fluid>
                <div className="float-end">
                    { auth?.role === "MANAGER"
                        &&
                        <Button className="buttonWithMargins" color="primary" onClick={() => setSorted(!sorted)}>
                            {sorted ? "Unsort" : "Sort by Name"}
                        </Button>
                    }
                    { auth?.role === "MANAGER"
                        &&
                        <Button className="buttonWithMargins" color="success" tag={Link} to="/categories/new">
                            Add Category
                        </Button>
                    }
                    { auth?.role === "MANAGER"
                        &&
                        <Button className="buttonWithMargins" onClick={generatePDF}>
                            Print
                        </Button>
                    }
                </div>
                <div ref={componentPDF}>
                    <h1>Categories</h1>
                    <Table className="mt-4">
                        <thead>
                        <tr>
                            <th>Name</th>
                            { auth?.role === "MANAGER" && <th width="20%">Actions</th> }
                        </tr>
                        </thead>
                        <tbody>
                        {categoryList}
                        </tbody>
                    </Table>
                </div>
            </Container>
        </div>
    );
};

export default CategoryList;