import React, { useEffect, useState } from 'react';
import {Button, Container, Form, FormGroup, Input, Label} from 'reactstrap';
import AppNavbar from '../AppNavbar';
import {Link, useNavigate, useParams} from 'react-router-dom';

const ProductEdit = () => {
    const initialFormState = {
        id_product: '',
        category_number: '',
        product_name: '',
        producer: '',
        characteristics: ''
    };

    const [product, setProduct] = useState(initialFormState);
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        fetch(`/api/products/${id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(response => response.json())
            .then(data => {
                setProduct(data);
            });

        fetch(`/api/categories`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(response => response.json())
            .then(data => {
                setCategories(data);
            });
    }, [id]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        const newValue = name === 'category_number' ? parseInt(value) : value;
        setProduct({ ...product, [name]: newValue });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        await fetch(`/api/products${product.id_product ? `/${product.id_product}` : ''}`, {
            method: (product.id_product) ? 'PUT' : 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        });
        setProduct(initialFormState);
        navigate('/products');
    }

    const categoryOptions = categories.map((category) => {
        return (
            <option key={category.category_number} value={category.category_number}>
                {category.category_name}
            </option>
        );
    });

    return (
        <div>
            <AppNavbar/>
            <Container>
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label for="category_number">Category</Label>
                        <Input
                            type="select"
                            name="category_number"
                            id="category_number"
                            required
                            value={product.category_number || ''}
                            onChange={handleChange}>
                            <option value="">Select Category</option>
                            {categoryOptions}
                        </Input>
                    </FormGroup>

                    <FormGroup>
                        <Label for="product_name">Product Name</Label>
                        <Input
                            type="text"
                            name="product_name"
                            id="product_name"
                            required
                            value={product.product_name || ''}
                            onChange={handleChange}
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label for="producer">Producer</Label>
                        <Input
                            type="text"
                            name="producer"
                            id="producer"
                            required
                            value={product.producer || ''}
                            onChange={handleChange}
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label for="characteristics">Characteristics</Label>
                        <Input
                            type="textarea"
                            name="characteristics"
                            id="characteristics"
                            required
                            value={product.characteristics || ''}
                            onChange={handleChange}
                        />
                    </FormGroup>

                    <FormGroup>
                        <Button color="primary" type="submit">Save</Button>{' '}
                        <Button color="secondary" tag={Link} to={"/products"}>Cancel</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div>
    );
};

export default ProductEdit;