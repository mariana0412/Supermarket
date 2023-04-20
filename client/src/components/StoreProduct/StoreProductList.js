import React, { useEffect, useState } from 'react';
import {
    Button,
    ButtonGroup,
    Container,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Input, Modal, ModalBody, ModalFooter, ModalHeader,
    Table
} from 'reactstrap';
import AppNavbar from '../AppNavbar';
import '../../App.css';
import { Link } from 'react-router-dom';
import useAuth from "../../hooks/useAuth";

const StoreProductList = () => {

    const [storeProducts, setStoreProducts] = useState([]);
    const [products, setProducts] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [sortOption, setSortOption] = useState(null);
    const [searchUPC, setSearchUPC] = useState('');
    const [modal, setModal] = useState(false);
    const [productDetails, setProductDetails] = useState(null);
    const {auth} = useAuth();

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

    const handleSearchInputChange = (event) => {
        setSearchUPC(event.target.value);
    }

    const toggleModal = () => {
        setModal(!modal);
        if(modal)
            setSearchUPC('');
    };

    const showContactInfo = async () => {
        try {
            const response = await fetch(`/api/store-products-details/${searchUPC}`);
            if (response.status === 404) {
                alert('There is no store product with such UPC.');
            } else {
                const data = await response.json();
                setProductDetails(data);
                toggleModal();
            }
        } catch (error) {
            console.log(error);
        }
    }

    const storeProductList = storeProducts.map(storeProduct => {
        return <tr key={storeProduct.upc}>
            <td>{storeProduct.upc}</td>
            <td style={{whiteSpace: 'nowrap'}}>{storeProduct.upc_prom ? storeProduct.upc_prom : 'missing'}</td>
            <td>{storeProduct.id_product} - {products.find(p => p.id_product === storeProduct.id_product)?.product_name}</td>
            <td>{storeProduct.selling_price}</td>
            <td>{storeProduct.products_number} </td>
            <td>{storeProduct.promotional_product.toString()}</td>
            { auth?.role === "MANAGER"
                &&
                <td>
                    <ButtonGroup>
                        <Button size="sm" color="primary" tag={Link} to={"/store-products/" + storeProduct.upc}>Edit</Button>
                        <Button size="sm" color="danger" onClick={() => remove(storeProduct.upc)}>Delete</Button>
                    </ButtonGroup>
                </td>
            }
        </tr>
    });

    return (
        <div>
            <AppNavbar/>
            <Container fluid>
                <h3>Store Product List</h3>

                { auth?.role === "MANAGER"
                    &&
                    <div className='search-container'>
                        <Input
                            style={{width: '200px' }}
                            type="text"
                            placeholder="Find more info by UPC"
                            value={searchUPC}
                            onChange={handleSearchInputChange}
                        />
                        <Button color="primary" onClick={() => showContactInfo()}>Search</Button>
                    </div>
                }

                <div className="float-end">
                    { auth?.role === "MANAGER"
                        &&
                        <Button className="buttonWithMargins" color="success" tag={Link} to="/store-products/new">
                            Add Store Product
                        </Button>
                    }
                    { auth?.role === "CASHIER"
                        &&
                        <Button className="buttonWithMargins" onClick={() => window.print()}>
                            Print
                        </Button>
                    }
                </div>

                { auth?.role === "MANAGER"
                    &&
                    <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                        <DropdownToggle caret>Sort</DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem onClick={() => toggleSort('num')}>all by number</DropdownItem>
                            <DropdownItem onClick={() => toggleSort('promNum')}>promotional by number</DropdownItem>
                            <DropdownItem onClick={() => toggleSort('promName')}>promotional by name</DropdownItem>
                            <DropdownItem onClick={() => toggleSort('notPromNum')}>not promotional by number</DropdownItem>
                            <DropdownItem onClick={() => toggleSort('notPromName')}>not promotional by name</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                }

                <Table className="mt-4">
                    <thead>
                    <tr>
                        <th>UPC</th>
                        <th>Promotional product UPC</th>
                        <th>Product ID</th>
                        <th>Selling Price</th>
                        <th>Products number</th>
                        <th>Is promotional?</th>
                        { auth?.role === "MANAGER" && <th width="10%">Actions</th>}
                    </tr>
                    </thead>
                    <tbody>
                    {storeProductList}
                    </tbody>
                </Table>

                <Modal isOpen={modal} toggle={toggleModal}>
                    <ModalHeader toggle={toggleModal}>Store Product Details</ModalHeader>
                    <ModalBody>
                        {productDetails && (
                            <>
                                <p>Name: {productDetails?.product_name}</p>
                                <p>Characteristics: {productDetails?.characteristics}</p>
                                <p>Products number: {productDetails?.products_number}</p>
                                <p>Selling price: {productDetails?.selling_price}</p>
                            </>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={toggleModal}>Close</Button>
                    </ModalFooter>
                </Modal>
            </Container>
        </div>
    );
};

export default StoreProductList;