import React, { useEffect, useState } from 'react';
import {Button, ButtonGroup, Container, FormGroup, Input, Table} from 'reactstrap';
import AppNavbar from '../AppNavbar';
import { Link } from 'react-router-dom';
import '../../App.css';
import useAuth from "../../hooks/useAuth";

const ProductList = () => {

    const [products, setProducts] = useState([]);
    const [sorted, setSorted] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const {auth} = useAuth();

    useEffect(() => {
        let url = `api/products`;
        if(sorted)
            url += `?sorted=true`;
        else if(selectedCategory)
            url += `?categoryId=` + selectedCategory;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                setProducts(data);
            });

        fetch(`/api/categories`)
            .then(response => response.json())
            .then(data => {
                setCategories(data);
            });
    }, [sorted, selectedCategory]);

    const remove = async (id) => {
        try {
            const response = await fetch(`/api/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (response.ok) {
                let updatedProducts = [...products].filter(i => i.id_product !== id);
                setProducts(updatedProducts);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const productList = products.map(product => {
        return <tr key={product.id_product}>
            <td style={{whiteSpace: 'nowrap'}}>{product.product_name}</td>
            <td>{product.category_number} - {categories.find(cat => cat.category_number === product.category_number)?.category_name}</td>
            <td>{product.characteristics}</td>
            { auth?.role === "MANAGER"
                &&
                <td>
                    <ButtonGroup>
                        <Button size="sm" color="primary" tag={Link} to={"/products/" + product.id_product}>Edit</Button>
                        <Button size="sm" color="danger" onClick={() => remove(product.id_product)}>Delete</Button>
                    </ButtonGroup>
                </td>
            }
        </tr>
    });

    const categoryOptions = categories.map((category) => {
        return (
            <option key={category.category_number} value={category.category_number}>
                {category.category_name}
            </option>
        );
    });

    const handleChange = (event) => {
        setSelectedCategory(event.target.value);
    }

    return (
        <div>
            <AppNavbar/>
            <Container fluid>
                <h3>Product List</h3>

                <div className="float-end">
                    { auth?.role === "MANAGER"
                        &&
                        <Button className="buttonWithMargins" color="primary" onClick={() => setSorted(!sorted)}>
                            {sorted ? "Unsort" : "Sort by Name"}
                        </Button>
                    }
                    { auth?.role === "MANAGER"
                        &&
                        <Button className="buttonWithMargins" color="success" tag={Link} to="/products/new">
                            Add Product
                        </Button>
                    }
                    { auth?.role === "MANAGER"
                        &&
                        <Button className="buttonWithMargins" onClick={() => window.print()}>
                            Print
                        </Button>
                    }
                </div>

                { auth?.role === "MANAGER"
                    &&
                    <FormGroup>
                        <Input style={{width: '200px'}}
                               type="select"
                               name="category_number"
                               id="category_number"
                               onChange={handleChange}>
                            <option value="">Select Category</option>
                            {categoryOptions}
                        </Input>
                    </FormGroup>
                }

                <Table className="mt-4">
                    <thead>
                    <tr>
                        <th width="40%">Name</th>
                        <th width="20%">Category</th>
                        <th width="30%">Characteristics</th>
                        { auth?.role === "MANAGER" && <th width="10%">Actions</th> }
                    </tr>
                    </thead>
                    <tbody>
                    {productList}
                    </tbody>
                </Table>
            </Container>
        </div>
    );
};

export default ProductList;