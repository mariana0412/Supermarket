import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';

const CategoryList = () => {

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        fetch('api/categories')
            .then(response => response.json())
            .then(data => {
                setCategories(data);
                setLoading(false);
            })
    }, []);

    const remove = async (id) => {
        await fetch(`/api/categories/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            console.log(response); // log the response to see if there are any errors
            let updatedCategories = [...categories].filter(i => i.category_number !== id);
            setCategories(updatedCategories);
        }).catch((error) => {
            console.log(error); // log any errors that occur
        });
    }

    if (loading) {
        return <p>Loading...</p>;
    }

    const categoryList = categories.map(category => {
        return <tr key={category.category_number}>
            <td style={{whiteSpace: 'nowrap'}}>{category.category_name}</td>
            <td>
                <ButtonGroup>
                    <Button size="sm" color="primary" tag={Link} to={"/categories/" + category.category_number}>Edit</Button>
                    <Button size="sm" color="danger" onClick={() => remove(category.category_number)}>Delete</Button>
                </ButtonGroup>
            </td>
        </tr>
    });

    return (
        <div>
            <AppNavbar/>
            <Container fluid>
                <div className="float-end">
                    <Button color="success" tag={Link} to="/categories/new">Add Category</Button>
                </div>
                <h3>Product Categories</h3>
                <Table className="mt-4">
                    <thead>
                    <tr>
                        <th width="80%">Name</th>
                        <th width="20%">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {categoryList}
                    </tbody>
                </Table>
            </Container>
        </div>
    );
};

export default CategoryList;