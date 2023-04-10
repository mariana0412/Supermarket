import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from '../AppNavbar';
import { Link } from 'react-router-dom';

const ProductList = () => {

    const [products, setProducts] = useState([]);
    const [sorted, setSorted] = useState(false);

    useEffect(() => {
        const url = sorted ? "api/products?sorted=true" : "api/products";

        fetch(url)
            .then(response => response.json())
            .then(data => {
                setProducts(data);
            })
    }, [sorted]);

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
                alert(data.message); // display error message to user
            }
        } catch (error) {
            console.log(error); // log any errors that occur
        }
    }

    const productList = products.map(product => {
        return <tr key={product.id_product}>
            <td style={{whiteSpace: 'nowrap'}}>{product.product_name}</td>
            <td>{product.category_number}</td>
            <td>{product.characteristics}</td>
            <td>
                <ButtonGroup>
                    <Button size="sm" color="primary" tag={Link} to={"/products/" + product.id_product}>Edit</Button>
                    <Button size="sm" color="danger" onClick={() => remove(product.id_product)}>Delete</Button>
                </ButtonGroup>
            </td>
        </tr>
    });

    return (
        <div>
            <AppNavbar/>
            <Container fluid>
                <div className="float-end">
                    <Button color="success" tag={Link} to="/products/new">Add Product</Button>
                    <Button color="primary" onClick={() => setSorted(!sorted)}>
                        {sorted ? "Unsort" : "Sort by Name"}
                    </Button>
                </div>
                <h3>Product List</h3>
                <Table className="mt-4">
                    <thead>
                    <tr>
                        <th width="40%">Name</th>
                        <th width="20%">Category</th>
                        <th width="30%">Characteristics</th>
                        <th width="10%">Actions</th>
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