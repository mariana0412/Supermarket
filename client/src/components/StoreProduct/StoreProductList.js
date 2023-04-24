import React, {useEffect, useRef, useState} from 'react';
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
import {useReactToPrint} from "react-to-print";

const StoreProductList = () => {

    const [storeProducts, setStoreProducts] = useState([]);
    const [sortedByName, setSortedByName] = useState(false);
    const [products, setProducts] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [sortOption, setSortOption] = useState(null);
    const [searchUPC, setSearchUPC] = useState('');
    const [modal, setModal] = useState(false);
    const [productDetails, setProductDetails] = useState(null);
    const [showEmpty, setShowEmpty] = useState(false);
    const {auth} = useAuth();
    const componentPDF = useRef();

    useEffect(() => {
        fetch(`/api/products`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
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
            else if(sortOption === 'name')
                url += 'sortedByName=true';
            else if (sortOption === 'promNum')
                url += 'promSortedByNum=true';
            else if (sortOption === 'promName')
                url += 'promSortedByName=true';
            else if (sortOption === 'notPromNum')
                url += 'notPromSortedByNum=true';
            else if (sortOption === 'notPromName')
                url += 'notPromSortedByName=true';
        }

        fetch(url, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(response => {
                if (response.status === 204)
                    return null;
                else
                    return response.json();
            })
            .then(data => {
                if (data) {
                    setStoreProducts(data);
                    setShowEmpty(data.length === 0);
                } else {
                    setStoreProducts([]);
                    setShowEmpty(true);
                }
            })
    }, [sortOption]);

    const remove = async (id) => {
        try {
            const response = await fetch(`/api/store-products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
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

    const showStoreProductDetails = async () => {
        try {
            const response = await fetch(`/api/store-products-details/${searchUPC}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            });
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
                        <Button className="buttonWithMargins" size="sm" color="primary" tag={Link} to={"/store-products/" + storeProduct.upc}>Edit</Button>
                        <Button className="buttonWithMargins" size="sm" color="danger" onClick={() => remove(storeProduct.upc)}>Delete</Button>
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
                        <Button className="buttonWithMargins" color="success" tag={Link} to="/store-products/new">
                            Add Store Product
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
                    <h1>Store Products</h1>
                    { auth.role === "CASHIER"
                        &&
                        <Button onClick={() => {
                            toggleSort('name');
                            setSortedByName(!sortedByName);
                        }}>
                            { sortedByName ? "Unsort" : "Sort by name" }
                        </Button>
                    }

                    <div className='search-container noPrint'>
                        <Input
                            style={{width: '200px' }}
                            type="text"
                            placeholder="Find more info by UPC"
                            value={searchUPC}
                            onChange={handleSearchInputChange}
                        />
                        <Button color="primary" onClick={() => showStoreProductDetails()}>Search</Button>
                    </div>

                    { auth?.role === "MANAGER"
                        &&
                        <Dropdown className="noPrint" isOpen={dropdownOpen} toggle={toggleDropdown}>
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
                    {showEmpty ?
                        <div className="text-center">
                            <p>No results found.</p>
                        </div>
                        :
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
                    }
                </div>

                <Modal isOpen={modal} toggle={toggleModal}>
                    <ModalHeader toggle={toggleModal}>Store Product Details</ModalHeader>
                    <ModalBody>
                        {productDetails && (
                            <>
                                <p>Name: {productDetails?.product_name}</p>
                                { auth?.role === "MANAGER" && <p>Characteristics: {productDetails?.characteristics}</p>}
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