import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import AppNavbar from '../AppNavbar';
import useLastPath from "../../hooks/useLastPath";

const CategoryEdit = () => {
    const initialFormState = {
        category_number: '',
        category_name: ''
    };
    const [category, setCategory] = useState(initialFormState);
    const navigate = useNavigate();
    const { id } = useParams();
    useLastPath();

    useEffect(() => {
        if (id !== 'new') {
            fetch(`/api/categories/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(data => setCategory(data));
        }
    }, [id, setCategory]);

    const handleChange = (event) => {
        const { name, value } = event.target

        setCategory({ ...category, [name]: value })
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        await fetch(`/api/categories${category.category_number ? `/${category.category_number}` : ''}`, {
            method: (category.category_number) ? 'PUT' : 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(category)
        });
        setCategory(initialFormState);
        navigate('/categories');
    }

    const title = <h2>{category.category_number ? 'Edit Category' : 'Add Category'}</h2>;

    return (<div>
            <AppNavbar/>
            <Container>
                {title}
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label for="category_name">Category Name</Label>
                        <Input
                            type="text"
                            name="category_name"
                            id="category_name"
                            required
                            value={category.category_name || ''}
                            onChange={handleChange}
                            autoComplete="category_name"
                        />
                    </FormGroup>

                    <FormGroup>
                        <Button color="primary" type="submit">Save</Button>{' '}
                        <Button color="secondary" tag={Link} to="/categories">Cancel</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div>
    )
};

export default CategoryEdit;