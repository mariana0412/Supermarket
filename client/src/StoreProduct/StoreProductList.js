import React, { useEffect, useState } from 'react';
import {Button, ButtonGroup, Container, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Table} from 'reactstrap';
import AppNavbar from '../AppNavbar';
import { Link } from 'react-router-dom';

const StoreProductList = () => {

    const [storeProducts, setStoreProducts] = useState([]);
    const [products, setProducts] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [sortOption, setSortOption] = useState(null);

    useEffect(() => {
        fetch(`/api/products`)
            .then(response => response.json())
            .then(data => {
                setProducts(data);
            });
    }, []);

    useEffect(() => {
        let url = 'api/store-products';
        if (sortOption) {
            url += '?';
            if (sortOption === 'num')
                url += 'sortedByNum=true';
            else if (sortOption === 'promNum')
                url += 'promSortedByNum=true';
            else if (sortOption === 'promName')
                url += 'promSortedByName=true';
            else if (sortOption === 'notPromNum')
                url += 'notPromSortedByNum=true';
            else if (sortOption === 'notPromName')
                url += 'notPromSortedByName=true';
        }

        fetch(url)
            .then(response => response.json())
            .then(data => {
                setStoreProducts(data);
            });
    }, [sortOption]);

    const remove = async (id) => {
        try {
            const response = await fetch(`/api/store-products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (response.ok) {
                let updatedStoreProducts = [...storeProducts].filter(i => i.upc !== id);
                setStoreProducts(updatedStoreProducts);
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

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    }

    const storeProductList = storeProducts.map(storeProduct => {
        return <tr key={storeProduct.upc}>
            <td style={{whiteSpace: 'nowrap'}}>{storeProduct.upc_prom ? storeProduct.upc_prom : 'missing'}</td>
            <td>{storeProduct.id_product} - {products.find(p => p.id_product === storeProduct.id_product)?.product_name}</td>
            <td>{storeProduct.selling_price}</td>
            <td>{storeProduct.products_number} </td>
            <td>{storeProduct.promotional_product.toString()}</td>
            <td>
                <ButtonGroup>
                    <Button size="sm" color="primary" tag={Link} to={"/store-products/" + storeProduct.upc}>Edit</Button>
                    <Button size="sm" color="danger" onClick={() => remove(storeProduct.upc)}>Delete</Button>
                </ButtonGroup>
            </td>
        </tr>
    });

    return (
        <div>
            <AppNavbar/>
            <Container fluid>
                <div className="float-end">
                    <Button color="success" tag={Link} to="/store-products/new">Add Store Product</Button>
                </div>
                <h3>Store Product List</h3>

                <Dropdown  className="float-right" isOpen={dropdownOpen} toggle={toggleDropdown}>
                    <DropdownToggle caret>Sort</DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem onClick={() => toggleSort('num')}>all by number</DropdownItem>
                        <DropdownItem onClick={() => toggleSort('promNum')}>promotional by number</DropdownItem>
                        <DropdownItem onClick={() => toggleSort('promName')}>promotional by name</DropdownItem>
                        <DropdownItem onClick={() => toggleSort('notPromNum')}>not promotional by number</DropdownItem>
                        <DropdownItem onClick={() => toggleSort('notPromName')}>not promotional by name</DropdownItem>
                    </DropdownMenu>
                </Dropdown>

                <Table className="mt-4">
                    <thead>
                    <tr>
                        <th>Promotional store product ID</th>
                        <th>Product ID</th>
                        <th>Selling Price</th>
                        <th>Products number</th>
                        <th>Is promotional?</th>
                        <th width="10%">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {storeProductList}
                    </tbody>
                </Table>
            </Container>
        </div>
    );
};

export default StoreProductList;